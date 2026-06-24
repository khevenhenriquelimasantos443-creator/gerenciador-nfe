-- =====================================================
-- Finn — Racha (divisão de contas com outras pessoas)
-- Rode no Supabase SQL Editor depois dos anteriores.
-- Idempotente (seguro rodar de novo).
-- =====================================================

create table if not exists public.splits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  category text not null default 'Outros',
  total_value numeric(12,2) not null check (total_value > 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists splits_user_id_idx on public.splits(user_id);

alter table public.splits enable row level security;

drop policy if exists "splits_select_own" on public.splits;
drop policy if exists "splits_insert_own" on public.splits;
drop policy if exists "splits_update_own" on public.splits;
drop policy if exists "splits_delete_own" on public.splits;

create policy "splits_select_own" on public.splits for select using (auth.uid() = user_id);
create policy "splits_insert_own" on public.splits for insert with check (auth.uid() = user_id);
create policy "splits_update_own" on public.splits for update using (auth.uid() = user_id);
create policy "splits_delete_own" on public.splits for delete using (auth.uid() = user_id);

create table if not exists public.split_participants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  split_id uuid not null references public.splits(id) on delete cascade,
  name text not null,
  value numeric(12,2) not null check (value >= 0),
  paid boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists split_participants_user_id_idx on public.split_participants(user_id);
create index if not exists split_participants_split_id_idx on public.split_participants(split_id);

alter table public.split_participants enable row level security;

drop policy if exists "split_participants_select_own" on public.split_participants;
drop policy if exists "split_participants_insert_own" on public.split_participants;
drop policy if exists "split_participants_update_own" on public.split_participants;
drop policy if exists "split_participants_delete_own" on public.split_participants;

create policy "split_participants_select_own" on public.split_participants for select using (auth.uid() = user_id);
create policy "split_participants_insert_own" on public.split_participants for insert with check (auth.uid() = user_id);
create policy "split_participants_update_own" on public.split_participants for update using (auth.uid() = user_id);
create policy "split_participants_delete_own" on public.split_participants for delete using (auth.uid() = user_id);
