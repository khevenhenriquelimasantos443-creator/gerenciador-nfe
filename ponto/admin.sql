-- ============================================================
-- CLOCKIN — Painel Admin
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Adiciona coluna email na tabela perfis (para buscas do admin)
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Atualiza trigger para incluir email ao criar usuário
CREATE OR REPLACE FUNCTION handle_new_user_ponto()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', ''), NEW.email)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  INSERT INTO public.config_descontos (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Popula email dos usuários já existentes
UPDATE perfis SET email = au.email
FROM auth.users au
WHERE perfis.id = au.id AND (perfis.email IS NULL OR perfis.email = '');

-- 4. Tabela de admins
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Função SECURITY DEFINER para checar admin (evita recursão nas políticas RLS)
CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
$$;

-- 6. Insere o admin
INSERT INTO admins (user_id) VALUES ('a44968ef-389a-4bc9-8fbc-e9a2a2d24f6a') ON CONFLICT DO NOTHING;

-- 7. Atualiza políticas RLS — admin enxerga todos os dados

DROP POLICY IF EXISTS "users_own_perfil" ON perfis;
CREATE POLICY "users_own_perfil" ON perfis FOR ALL
  USING (auth.uid() = id OR check_is_admin());

DROP POLICY IF EXISTS "users_own_ponto" ON registros_ponto;
CREATE POLICY "users_own_ponto" ON registros_ponto FOR ALL
  USING (auth.uid() = user_id OR check_is_admin());

DROP POLICY IF EXISTS "users_own_config" ON config_descontos;
CREATE POLICY "users_own_config" ON config_descontos FOR ALL
  USING (auth.uid() = user_id OR check_is_admin());

DROP POLICY IF EXISTS "users_own_descontos" ON descontos_extras;
CREATE POLICY "users_own_descontos" ON descontos_extras FOR ALL
  USING (auth.uid() = user_id OR check_is_admin());

DROP POLICY IF EXISTS "users_own_holerites" ON holerites;
CREATE POLICY "users_own_holerites" ON holerites FOR ALL
  USING (auth.uid() = user_id OR check_is_admin());
