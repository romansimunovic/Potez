const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, max-age=0'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export async function onRequestPost({ request, env }) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  const allowedOrigin = (env.APP_ORIGIN || requestUrl.origin).replace(/\/$/, '');

  if (!origin || origin.replace(/\/$/, '') !== allowedOrigin || requestUrl.origin !== allowedOrigin) {
    return json({ error: 'Zahtjev nije dopušten.' }, 403);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ error: 'Očekuje se JSON zahtjev.' }, 415);
  }

  const declaredLength = Number(request.headers.get('Content-Length') || 0);
  if (declaredLength > 5000) return json({ error: 'Poruka je prevelika.' }, 413);

  if (!env.SUPABASE_URL || !env.SUPABASE_API_KEY || !env.TURNSTILE_SECRET_KEY) {
    return json({ error: 'Obrazac još nije konfiguriran.' }, 503);
  }

  let payload;
  try {
    const raw = await request.text();
    if (raw.length > 5000) return json({ error: 'Poruka je prevelika.' }, 413);
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'Neispravan format poruke.' }, 400);
  }

  // Honeypot: real users should leave this field empty.
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

  // Verify Turnstile server-side. Do not trust a browser-provided success flag.
  let captcha;
  try {
    const verificationBody = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken
    });
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verificationBody
    });
    if (!verificationResponse.ok) return json({ error: 'Sigurnosnu provjeru nije moguće potvrditi.' }, 502);
    captcha = await verificationResponse.json();
  } catch {
    return json({ error: 'Sigurnosnu provjeru trenutačno nije moguće potvrditi.' }, 502);
  }

  if (!captcha.success || captcha.hostname !== requestUrl.hostname) {
    return json({ error: 'Sigurnosna provjera nije prošla. Pokušaj ponovno.' }, 403);
  }

  // The anon key is intentionally used with a strict INSERT-only RLS policy.
  // Never put a Supabase service-role key in the browser or this function.
  const supabaseUrl = env.SUPABASE_URL.replace(/\/$/, '');
  let dbResponse;
  try {
    dbResponse = await fetch(`${supabaseUrl}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_API_KEY,
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
    // Log only status, not the submitted message or secrets.
    console.error('POTEZ feedback database error:', dbResponse.status);
    return json({ error: 'Poruku trenutačno nije moguće spremiti. Pokušaj ponovno kasnije.' }, 502);
  }

  return json({ ok: true }, 201);
}
