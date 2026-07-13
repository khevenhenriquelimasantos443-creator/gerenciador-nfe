-- =====================================================
-- Finn — Assinaturas (planos Free/Plus/Pro via Mercado Pago)
-- Rode no Supabase SQL Editor depois dos anteriores.
-- Idempotente (seguro rodar de novo).
--
-- Sem linha nesta tabela = plano "free" (o app trata a ausência de
-- registro como free por padrão, não precisa de trigger criando linha
-- pra todo usuário novo).
--
-- IMPORTANTE: não existe policy de insert/update/delete pra usuários
-- comuns de propósito — só o Worker (via SUPABASE_SERVICE_KEY, que
-- ignora RLS) pode mudar o plano de alguém. Se um usuário comum
-- conseguisse fazer PATCH nessa tabela, daria pra ele mesmo se dar
-- acesso Pro de graça.
-- =====================================================

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','plus','pro')),
  status text not null default 'active' check (status in ('active','past_due','cancelled','trialing')),
  mp_subscription_id text,
  mp_payment_id text,
  current_period_end timestamptz,
  ai_usage_count integer not null default 0,
  ai_usage_month text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_mp_subscription_id_idx on public.subscriptions(mp_subscription_id);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;

create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
