-- =====================================================
-- Finn — Metas de economia + Contas fixas/recorrentes
-- Rode no Supabase SQL Editor depois de schema.sql e
-- 02_spending_limits.sql. Idempotente (seguro rodar de novo).
-- =====================================================

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text not null default '🎯',
  target numeric(12,2) not null check (target > 0),
  saved numeric(12,2) not null default 0 check (saved >= 0),
  deadline date,
  created_at timestamptz not null default now()
);

create index if not exists goals_user_id_idx on public.goals(user_id);

alter table public.goals enable row level security;

drop policy if exists "goals_select_own" on public.goals;
drop policy if exists "goals_insert_own" on public.goals;
drop policy if exists "goals_update_own" on public.goals;
drop policy if exists "goals_delete_own" on public.goals;

create policy "goals_select_own" on public.goals for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals for update using (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals for delete using (auth.uid() = user_id);

create table if not exists public.fixed_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  category text not null default 'Outros',
  type text not null check (type in ('receita','despesa')) default 'despesa',
  value numeric(12,2) not null check (value >= 0),
  day_of_month integer not null check (day_of_month between 1 and 31) default 1,
  launched_months text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists fixed_accounts_user_id_idx on public.fixed_accounts(user_id);

alter table public.fixed_accounts enable row level security;

drop policy if exists "fixed_accounts_select_own" on public.fixed_accounts;
drop policy if exists "fixed_accounts_insert_own" on public.fixed_accounts;
drop policy if exists "fixed_accounts_update_own" on public.fixed_accounts;
drop policy if exists "fixed_accounts_delete_own" on public.fixed_accounts;

create policy "fixed_accounts_select_own" on public.fixed_accounts for select using (auth.uid() = user_id);
create policy "fixed_accounts_insert_own" on public.fixed_accounts for insert with check (auth.uid() = user_id);
create policy "fixed_accounts_update_own" on public.fixed_accounts for update using (auth.uid() = user_id);
create policy "fixed_accounts_delete_own" on public.fixed_accounts for delete using (auth.uid() = user_id);
