-- POTEZ pilot: private feedback inbox.
-- Public roles cannot insert, read, update, or delete feedback directly.
-- The Cloudflare Pages Function validates Turnstile before using a server-only
-- Supabase secret key. Never put that key in frontend code or source control.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  feedback_type text not null
    check (feedback_type in ('general', 'idea', 'bug')),
  section text not null
    check (section in ('overall', 'quiz', 'budget', 'factcheck', 'action', 'resources', 'mobile')),
  rating smallint null
    check (rating is null or rating between 1 and 5),
  message text not null
    check (char_length(btrim(message)) between 10 and 1200)
);

alter table public.feedback enable row level security;

-- A public/publishable key must not be able to bypass Turnstile by calling
-- the Supabase REST endpoint directly.
revoke all on table public.feedback from public, anon, authenticated, service_role;

-- The secret key maps to service_role. Restrict the role to INSERT on only
-- the four submitted fields. It receives no SELECT, UPDATE, DELETE or TRUNCATE.
grant usage on schema public to service_role;
grant insert (feedback_type, section, rating, message)
  on table public.feedback to service_role;

drop policy if exists "Allow anonymous feedback submissions" on public.feedback;
drop policy if exists "Allow server feedback submissions" on public.feedback;

comment on table public.feedback is
  'Private POTEZ pilot feedback. Public roles have no table access. Server-only insert is validated by the Cloudflare Pages Function.';
