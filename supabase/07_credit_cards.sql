-- =====================================================
-- Finn — Gestão de cartão de crédito (fatura, fechamento, limite)
-- Rode no Supabase SQL Editor depois dos anteriores.
-- Idempotente (seguro rodar de novo).
-- =====================================================

create table if not exists public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  limit_value numeric(12,2) not null default 0 check (limit_value >= 0),
  closing_day integer not null check (closing_day between 1 and 31) default 1,
  due_day integer not null check (due_day between 1 and 31) default 10,
  created_at timestamptz not null default now()
);

create index if not exists credit_cards_user_id_idx on public.credit_cards(user_id);

alter table public.credit_cards enable row level security;

drop policy if exists "credit_cards_select_own" on public.credit_cards;
drop policy if exists "credit_cards_insert_own" on public.credit_cards;
drop policy if exists "credit_cards_update_own" on public.credit_cards;
drop policy if exists "credit_cards_delete_own" on public.credit_cards;

create policy "credit_cards_select_own" on public.credit_cards for select using (auth.uid() = user_id);
create policy "credit_cards_insert_own" on public.credit_cards for insert with check (auth.uid() = user_id);
create policy "credit_cards_update_own" on public.credit_cards for update using (auth.uid() = user_id);
create policy "credit_cards_delete_own" on public.credit_cards for delete using (auth.uid() = user_id);

-- liga um lançamento de despesa a um cartão (opcional — null = dinheiro/débito/pix)
alter table public.transactions add column if not exists card_id uuid references public.credit_cards(id) on delete set null;

create index if not exists transactions_card_id_idx on public.transactions(card_id);
