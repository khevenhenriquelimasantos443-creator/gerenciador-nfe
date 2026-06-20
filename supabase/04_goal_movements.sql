-- =====================================================
-- Finn — Histórico de movimentações das metas
-- Rode no Supabase SQL Editor depois dos anteriores.
-- Idempotente (seguro rodar de novo).
-- =====================================================

create table if not exists public.goal_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('deposito','retirada')),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists goal_movements_user_id_idx on public.goal_movements(user_id);
create index if not exists goal_movements_goal_id_idx on public.goal_movements(goal_id);

alter table public.goal_movements enable row level security;

drop policy if exists "goal_movements_select_own" on public.goal_movements;
drop policy if exists "goal_movements_insert_own" on public.goal_movements;
drop policy if exists "goal_movements_delete_own" on public.goal_movements;

create policy "goal_movements_select_own" on public.goal_movements for select using (auth.uid() = user_id);
create policy "goal_movements_insert_own" on public.goal_movements for insert with check (auth.uid() = user_id);
create policy "goal_movements_delete_own" on public.goal_movements for delete using (auth.uid() = user_id);
