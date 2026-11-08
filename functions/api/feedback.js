const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff'
};

const MAX_BODY_BYTES = 5000;
const EXPECTED_TURNSTILE_ACTION = 'feedback';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

async function readBoundedBody(request) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function getExpectedOrigin(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
    if ((!isLocal && url.protocol !== 'https:') ||
        (isLocal && !['http:', 'https:'].includes(url.protocol)) ||
        url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export async function onRequestPost({ request, env }) {
  const requestUrl = new URL(request.url);
  const expectedOrigin = getExpectedOrigin(env.APP_ORIGIN);
  if (!expectedOrigin) return json({ error: 'Obrazac još nije konfiguriran.' }, 503);

  const origin = request.headers.get('Origin');
  if (origin !== expectedOrigin || requestUrl.origin !== expectedOrigin) {
    return json({ error: 'Zahtjev nije dopušten.' }, 403);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return json({ error: 'Očekuje se JSON zahtjev.' }, 415);
  }

  const declaredLength = request.headers.get('Content-Length');
  if (declaredLength !== null) {
    if (!/^\d+$/.test(declaredLength)) return json({ error: 'Neispravna veličina zahtjeva.' }, 400);
    if (Number(declaredLength) > MAX_BODY_BYTES) return json({ error: 'Poruka je prevelika.' }, 413);
  }

  if (!env.SUPABASE_URL ||
      typeof env.SUPABASE_SECRET_KEY !== 'string' ||
      !env.SUPABASE_SECRET_KEY.startsWith('sb_secret_') ||
      !env.TURNSTILE_SECRET_KEY) {
    return json({ error: 'Obrazac još nije konfiguriran.' }, 503);
  }

  let supabaseUrl;
  try {
    const parsed = new URL(env.SUPABASE_URL);
    if (parsed.protocol !== 'https:' || parsed.pathname !== '/' || parsed.search || parsed.hash) {
      return json({ error: 'Konfiguracija baze nije valjana.' }, 503);
    }
    supabaseUrl = parsed.origin;
  } catch {
    return json({ error: 'Konfiguracija baze nije valjana.' }, 503);
  }

  let raw;
  try {
    raw = await readBoundedBody(request);
  } catch {
    return json({ error: 'Neispravno kodirana poruka.' }, 400);
  }
  if (raw === null) return json({ error: 'Poruka je prevelika.' }, 413);

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'Neispravan format poruke.' }, 400);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json({ error: 'Neispravan format poruke.' }, 400);
  }

  if (typeof payload.website === 'string' && payload.website.trim()) {
    return json({ ok: true }, 200);
  }

  const allowedTypes = new Set(['general', 'idea', 'bug']);
  const allowedSections = new Set(['overall', 'quiz', 'budget', 'factcheck', 'action', 'resources', 'mobile']);
  const feedbackType = typeof payload.feedback_type === 'string' ? payload.feedback_type : '';
  const section = typeof payload.section === 'string' ? payload.section : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const rating = payload.rating === null || payload.rating === '' || typeof payload.rating === 'undefined'
    ? null
    : Number(payload.rating);
  const turnstileToken = typeof payload.turnstile_token === 'string' ? payload.turnstile_token : '';

  if (!allowedTypes.has(feedbackType) || !allowedSections.has(section)) {
    return json({ error: 'Odabrana kategorija nije valjana.' }, 400);
  }
  if (message.length < 10 || message.length > 1200) {
    return json({ error: 'Poruka mora imati između 10 i 1.200 znakova.' }, 400);
  }
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return json({ error: 'Ocjena nije valjana.' }, 400);
  }
  if (!turnstileToken || turnstileToken.length > 2048) {
    return json({ error: 'Sigurnosna provjera nije dovršena.' }, 400);
  }

  let captcha;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const verificationBody = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken
    });
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verificationBody,
      signal: controller.signal
    });
    if (!verificationResponse.ok) return json({ error: 'Sigurnosnu provjeru nije moguće potvrditi.' }, 502);
    captcha = await verificationResponse.json();
  } catch {
    return json({ error: 'Sigurnosnu provjeru trenutačno nije moguće potvrditi.' }, 502);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!captcha ||
      captcha.success !== true ||
      captcha.hostname !== requestUrl.hostname ||
      captcha.action !== EXPECTED_TURNSTILE_ACTION) {
    return json({ error: 'Sigurnosna provjera nije prošla. Pokušaj ponovno.' }, 403);
  }

  // Elevated key; server-side only. SQL restricts service_role to feedback INSERT columns.
  let dbResponse;
  try {
    dbResponse = await fetch(supabaseUrl + '/rest/v1/feedback', {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SECRET_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        feedback_type: feedbackType,
        section,
        rating,
        message
      })
    });
  } catch {
    return json({ error: 'Baza trenutačno nije dostupna. Pokušaj ponovno kasnije.' }, 502);
  }

  if (!dbResponse.ok) {
    console.error('POTEZ feedback database error:', dbResponse.status);
    return json({ error: 'Poruku trenutačno nije moguće spremiti. Pokušaj ponovno kasnije.' }, 502);
  }

  return json({ ok: true }, 201);
}
