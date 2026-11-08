-- POTEZ pilot: anonymous, private feedback inbox.
-- No accounts, names, email addresses, political preferences or IP addresses are stored.

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

-- Only anonymous INSERT is allowed. No public read, update or delete access.
revoke all on table public.feedback from public, anon, authenticated;
grant insert (feedback_type, section, rating, message) on public.feedback to anon;

drop policy if exists "Allow anonymous feedback submissions" on public.feedback;
create policy "Allow anonymous feedback submissions"
  on public.feedback
  for insert
  to anon
  with check (
    feedback_type in ('general', 'idea', 'bug')
    and section in ('overall', 'quiz', 'budget', 'factcheck', 'action', 'resources', 'mobile')
    and (rating is null or rating between 1 and 5)
    and char_length(btrim(message)) between 10 and 1200
  );

comment on table public.feedback is
  'Private POTEZ pilot feedback. Submitted anonymously; public roles cannot read rows.';
