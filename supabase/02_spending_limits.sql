-- =====================================================
-- Finn — Limites de gasto por categoria
-- Rode no Supabase SQL Editor DEPOIS do schema.sql.
-- Seguro de rodar mais de uma vez (idempotente).
-- =====================================================

create table if not exists public.spending_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  monthly_limit numeric(12,2) not null check (monthly_limit >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, category)
);

create index if not exists spending_limits_user_id_idx on public.spending_limits(user_id);

alter table public.spending_limits enable row level security;

drop policy if exists "spending_limits_select_own" on public.spending_limits;
drop policy if exists "spending_limits_insert_own" on public.spending_limits;
drop policy if exists "spending_limits_update_own" on public.spending_limits;
drop policy if exists "spending_limits_delete_own" on public.spending_limits;

create policy "spending_limits_select_own" on public.spending_limits
  for select using (auth.uid() = user_id);
create policy "spending_limits_insert_own" on public.spending_limits
  for insert with check (auth.uid() = user_id);
create policy "spending_limits_update_own" on public.spending_limits
  for update using (auth.uid() = user_id);
create policy "spending_limits_delete_own" on public.spending_limits
  for delete using (auth.uid() = user_id);
