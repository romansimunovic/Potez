import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../functions/api/feedback.js', import.meta.url), 'utf8');
const { onRequestPost } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

const ORIGIN = 'https://potez.pages.dev';
const ENV = {
  APP_ORIGIN: ORIGIN,
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SECRET_KEY: 'sb_secret_test_only',
  TURNSTILE_SECRET_KEY: 'turnstile-test-only'
};

function request(body, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Origin')) headers.set('Origin', ORIGIN);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const init = { method: options.method || 'POST', headers };
  if (body !== undefined) init.body = body;
  return new Request(ORIGIN + '/api/feedback', init);
}

function validPayload(overrides = {}) {
  return JSON.stringify({
    feedback_type: 'general',
    section: 'overall',
    rating: 5,
    message: 'Korisna platforma za mlade.',
    turnstile_token: 'valid-test-token',
    ...overrides
  });
}

test('rejects requests without the exact allowed origin', async () => {
  const req = request(validPayload(), { headers: { Origin: 'https://attacker.example' } });
  const response = await onRequestPost({ request: req, env: ENV });
  assert.equal(response.status, 403);
});

test('rejects non-JSON content types', async () => {
  const req = request('hello', { headers: { 'Content-Type': 'text/plain' } });
  const response = await onRequestPost({ request: req, env: ENV });
  assert.equal(response.status, 415);
});

test('rejects an oversized body even when Content-Length is absent', async () => {
  const req = request('x'.repeat(5001));
  const response = await onRequestPost({ request: req, env: ENV });
  assert.equal(response.status, 413);
});

test('fails closed when server secrets are missing', async () => {
  const req = request(validPayload());
  const response = await onRequestPost({ request: req, env: { APP_ORIGIN: ORIGIN } });
  assert.equal(response.status, 503);
});

test('rejects a Turnstile token that fails server verification', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    success: false,
    hostname: 'potez.pages.dev',
    action: 'feedback'
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  try {
    const response = await onRequestPost({ request: request(validPayload()), env: ENV });
    assert.equal(response.status, 403);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('inserts only validated feedback after successful Turnstile verification', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('siteverify')) {
      return new Response(JSON.stringify({
        success: true,
        hostname: 'potez.pages.dev',
        action: 'feedback'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(null, { status: 201 });
  };

  try {
    const response = await onRequestPost({ request: request(validPayload()), env: ENV });
    assert.equal(response.status, 201);
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, 'https://example.supabase.co/rest/v1/feedback');
    assert.equal(calls[1].init.headers.apikey, ENV.SUPABASE_SECRET_KEY);
    assert.deepEqual(JSON.parse(calls[1].init.body), {
      feedback_type: 'general',
      section: 'overall',
      rating: 5,
      message: 'Korisna platforma za mlade.'
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
