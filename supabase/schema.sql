-- =====================================================
-- Finn — Schema novo (rebuild "do zero")
-- Escopo MVP: login + lançamentos + dashboard.
-- Rode este script inteiro no Supabase SQL Editor.
--
-- ATENÇÃO: os DROP TABLE abaixo apagam PERMANENTEMENTE
-- os dados antigos (transactions, goals, limits_config,
-- fixed_accounts, user_settings). Não há volta.
-- Se quiser guardar algo, exporte antes de rodar.
-- =====================================================

create extension if not exists pgcrypto;

-- 1. Remove tudo que existia
drop table if exists public.transactions cascade;
drop table if exists public.goals cascade;
drop table if exists public.limits_config cascade;
drop table if exists public.fixed_accounts cascade;
drop table if exists public.user_settings cascade;
drop table if exists public.profiles cascade;

-- 2. Perfis (1 linha por usuário autenticado)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Lançamentos (receitas e despesas) — único dado do MVP
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('receita', 'despesa')),
  category text not null default 'Outros',
  description text not null default '',
  value numeric(12,2) not null check (value >= 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index transactions_user_id_idx on public.transactions(user_id);
create index transactions_date_idx on public.transactions(date);

alter table public.transactions enable row level security;

create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

-- Tabelas futuras (metas, limites, contas fixas, configurações,
-- bancos/Pluggy) serão adicionadas com scripts separados quando
-- essas funcionalidades voltarem ao app, uma de cada vez.
