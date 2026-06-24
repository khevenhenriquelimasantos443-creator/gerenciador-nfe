-- =====================================================
-- Finn — Categorias personalizadas
-- Rode no Supabase SQL Editor depois dos anteriores.
-- Idempotente (seguro rodar de novo).
-- =====================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

create index if not exists categories_user_id_idx on public.categories(user_id);

alter table public.categories enable row level security;

drop policy if exists "categories_select_own" on public.categories;
drop policy if exists "categories_insert_own" on public.categories;
drop policy if exists "categories_delete_own" on public.categories;

create policy "categories_select_own" on public.categories for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories for insert with check (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories for delete using (auth.uid() = user_id);
