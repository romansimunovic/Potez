# POTEZ

POTEZ is a static, mobile-first civic-literacy platform deployed on Cloudflare Pages.

## Architecture

- Static frontend: HTML, CSS and vanilla JavaScript.
- Hosting and CDN: Cloudflare Pages.
- Server endpoint: Cloudflare Pages Function at POST /api/feedback.
- Optional feedback storage: Supabase Postgres.
- Bot protection: Cloudflare Turnstile, validated server-side.
- Quiz answers and progress: local browser storage only; no user accounts or political profiles.

The public site does not need a database for its core learning features. Keep feedback disabled until the privacy notice, Turnstile widget, Supabase project and server-side secrets are configured.

## Deploy

Connect this repository to a Cloudflare Pages project (not a Workers Builds project).

- Production branch: main
- Framework preset: None
- Build command: leave empty
- Build output directory: .
- Root directory: repository root

Cloudflare Pages deploys the static files and the functions/ directory together.

## Feedback setup — do not enable before completing privacy review

1. Create a Turnstile widget and allow only the production hostname.
2. Apply supabase/migrations/202611080001_feedback.sql in the Supabase SQL Editor.
3. In Cloudflare Pages > Settings > Variables and Secrets, configure production values:
   - APP_ORIGIN: exact public origin, for example https://potez.example (no path or trailing slash).
   - SUPABASE_URL: Supabase project URL.
   - SUPABASE_SECRET_KEY: a Supabase secret key beginning with sb_secret_. Store it as a Secret, never as a plain variable.
   - TURNSTILE_SECRET_KEY: Turnstile secret key. Store it as a Secret.
4. In assets/config.js, set the public Turnstile site key and set privacyNoticeReady: true only after the privacy notice is complete.
5. Complete every placeholder in privacy.html: controller identity and contact, legal basis, retention period, deletion process, and processor information.
6. Deploy and test the form with a real Turnstile challenge. Confirm that direct Supabase inserts using the public key are rejected.

The Supabase secret key bypasses RLS. It is used only by the server-side Pages Function. The SQL migration revokes public table access and gives the server role only INSERT permission on the four feedback fields. Do not add the secret key to assets/config.js, HTML, JavaScript delivered to browsers, GitHub, or screenshots.

Supabase is transitioning from legacy anon / service_role keys to sb_publishable_ / sb_secret_ keys; use the new key format for new setup.

## Security controls

- _headers defines CSP, HSTS and browser security headers.
- _routes.json invokes Pages Functions only for /api/*.
- /api/feedback requires the exact configured origin, JSON, a bounded request body, validated fields, a server-verified Turnstile token for the feedback action, and a server-side Supabase secret.
- The API never returns stored feedback and never logs submitted message contents.
- Service-worker requests exclude /api/*; static app resources use network-first caching so new deployments are not indefinitely hidden behind stale cached JavaScript.

For public deployments, add a Cloudflare rate-limiting rule for POST /api/feedback on a custom domain/zone where WAF rules are available. Start conservatively and monitor false positives before tightening limits.

## Local checks

Run:

    bash scripts/check.sh

Preview static files:

    python -m http.server 8000

For local Pages Functions, use the Cloudflare Pages local development workflow and supply local secrets via an ignored .dev.vars file. Never commit .dev.vars.

## Privacy by design

Do not add political-preference profiling, location tracking, or accounts merely to support the educational modules. If new data collection is introduced, document its purpose, legal basis, minimization, retention period, access controls and deletion procedure before launch.

## Civic journey and gamification

The civic passport turns existing learning activities into a visible skills path:
understanding context, checking claims, weighing public priorities, and finding a
real participation route. XP and badges reward completing learning tasks; they
do not score political opinions, party preferences, or the perceived worth of
a person's real-world civic activity. There are no daily streak penalties,
public rankings, accounts, or political profiles.

The two-player budget comparison is a local pass-and-play exercise on one device.
Its saved allocations stay in that browser and are not sent to a server. Sharing
buttons share only a generic invitation or the player's own progress summary.

Do not present sample personas or invented aggregate percentages as real player
results. A future cross-device community board would require a separate opt-in
data design, transparent purpose and retention rules, abuse prevention, and
minimum aggregation thresholds before launch. Prefer aggregated learning
patterns over public individual profiles or location/political-interest ranking.
