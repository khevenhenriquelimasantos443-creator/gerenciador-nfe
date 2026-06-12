-- ============================================================
-- PONTUAL — Migração v2
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- (depois de já ter rodado o schema.sql principal)
-- ============================================================

-- Colunas de auditoria de edição nos registros de ponto
ALTER TABLE registros_ponto ADD COLUMN IF NOT EXISTS editado       BOOLEAN   DEFAULT FALSE;
ALTER TABLE registros_ponto ADD COLUMN IF NOT EXISTS motivo_edicao TEXT;
ALTER TABLE registros_ponto ADD COLUMN IF NOT EXISTS editado_em    TIMESTAMPTZ;

-- Tabela de atestados médicos
CREATE TABLE IF NOT EXISTS atestados_medicos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  tipo            TEXT NOT NULL CHECK (tipo IN ('dia_completo','horas_parciais')),
  data_inicio     DATE NOT NULL,
  data_fim        DATE NOT NULL,
  horas_abonadas  NUMERIC,
  observacao      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atestados_medicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_atestados" ON atestados_medicos FOR ALL USING (auth.uid() = user_id);
