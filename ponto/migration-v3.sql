-- ============================================================
-- ClockIn — Migração v3
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- Tabela de dias justificados (feriados, folgas, DSR)
CREATE TABLE IF NOT EXISTS dias_justificados (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  data       DATE NOT NULL,
  tipo       TEXT NOT NULL CHECK (tipo IN ('feriado', 'dsr', 'folga')),
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dias_justificados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_dias_justificados" ON dias_justificados
  FOR ALL USING (auth.uid() = user_id);

-- Impede duplicata do mesmo dia para o mesmo usuário
CREATE UNIQUE INDEX IF NOT EXISTS dias_justificados_user_data_unique
  ON dias_justificados(user_id, data);
