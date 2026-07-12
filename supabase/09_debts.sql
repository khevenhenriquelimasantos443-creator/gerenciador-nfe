-- =====================================================
-- Finn — Dívidas (controle e simulação de quitação)
-- Rode no Supabase SQL Editor depois dos anteriores.
-- Idempotente (seguro rodar de novo).
-- =====================================================

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'Outros',
  total_value numeric(12,2) not null default 0 check (total_value >= 0),
  remaining_value numeric(12,2) not null default 0 check (remaining_value >= 0),
  interest_rate numeric(6,2) not null default 0 check (interest_rate >= 0), -- % ao mês
  monthly_payment numeric(12,2) not null default 0 check (monthly_payment >= 0),
  due_day integer check (due_day between 1 and 31),
  created_at timestamptz not null default now()
);

create index if not exists debts_user_id_idx on public.debts(user_id);

alter table public.debts enable row level security;

drop policy if exists "debts_select_own" on public.debts;
drop policy if exists "debts_insert_own" on public.debts;
drop policy if exists "debts_update_own" on public.debts;
drop policy if exists "debts_delete_own" on public.debts;

create policy "debts_select_own" on public.debts for select using (auth.uid() = user_id);
create policy "debts_insert_own" on public.debts for insert with check (auth.uid() = user_id);
create policy "debts_update_own" on public.debts for update using (auth.uid() = user_id);
create policy "debts_delete_own" on public.debts for delete using (auth.uid() = user_id);
