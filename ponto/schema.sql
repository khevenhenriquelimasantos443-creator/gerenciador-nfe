-- ============================================================
-- RELÓGIO DE PONTO INTELIGENTE — Schema Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- Perfis de usuário (estende auth.users)
CREATE TABLE IF NOT EXISTS perfis (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  salario_base NUMERIC DEFAULT 0,
  carga_horaria_diaria NUMERIC DEFAULT 8,
  carga_horaria_mensal NUMERIC DEFAULT 220,
  percentual_he_50 NUMERIC DEFAULT 50,
  percentual_he_100 NUMERIC DEFAULT 100,
  horario_entrada TIME DEFAULT '08:00',
  horario_saida TIME DEFAULT '17:00',
  intervalo_minutos INTEGER DEFAULT 60,
  dia_pagamento INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registros de ponto (batidas)
CREATE TABLE IF NOT EXISTS registros_ponto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada','saida_almoco','retorno_almoco','saida')),
  timestamp TIMESTAMPTZ NOT NULL,
  data DATE NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Descontos padrão configurados por usuário
CREATE TABLE IF NOT EXISTS config_descontos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  inss_ativo BOOLEAN DEFAULT TRUE,
  irrf_ativo BOOLEAN DEFAULT TRUE,
  vt_valor NUMERIC DEFAULT 0,
  vt_ativo BOOLEAN DEFAULT TRUE,
  vr_valor NUMERIC DEFAULT 0,
  vr_ativo BOOLEAN DEFAULT TRUE,
  plano_saude_valor NUMERIC DEFAULT 0,
  plano_saude_ativo BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Descontos extras (custom) por usuário
CREATE TABLE IF NOT EXISTS descontos_extras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('fixo','percentual')),
  valor NUMERIC NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Holerites enviados
CREATE TABLE IF NOT EXISTS holerites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL,
  arquivo_nome TEXT,
  arquivo_url TEXT,
  salario_bruto NUMERIC,
  salario_liquido NUMERIC,
  total_descontos NUMERIC,
  he_50_horas NUMERIC DEFAULT 0,
  he_100_horas NUMERIC DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_ponto ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_descontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE descontos_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE holerites ENABLE ROW LEVEL SECURITY;

-- Policies: cada usuário só vê/edita os próprios dados
CREATE POLICY "users_own_perfil" ON perfis FOR ALL USING (auth.uid() = id);
CREATE POLICY "users_own_ponto" ON registros_ponto FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_config" ON config_descontos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_descontos" ON descontos_extras FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_holerites" ON holerites FOR ALL USING (auth.uid() = user_id);

-- Storage bucket para holerites
INSERT INTO storage.buckets (id, name, public) VALUES ('holerites', 'holerites', false) ON CONFLICT DO NOTHING;

CREATE POLICY "users_upload_holerites" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'holerites' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users_read_holerites" ON storage.objects
  FOR SELECT USING (bucket_id = 'holerites' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users_delete_holerites" ON storage.objects
  FOR DELETE USING (bucket_id = 'holerites' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger: cria perfil automaticamente ao criar usuário
-- ATENÇÃO: se já existir um trigger "on_auth_user_created" no projeto,
-- adicione apenas as duas linhas INSERT dentro da função existente.
CREATE OR REPLACE FUNCTION handle_new_user_ponto()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, nome)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', ''))
    ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.config_descontos (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created_ponto ON auth.users;
CREATE TRIGGER on_auth_user_created_ponto
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_ponto();
