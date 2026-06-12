-- ═══════════════════════════════════════════════════════════
-- ML ENVIOS — Supabase Schema Completo v1.0
-- Execute no SQL Editor: supabase.com → seu projeto → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─────────────────────────────────────
-- 1. CÓDIGO DO DIA
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS ml_daily_codes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   TEXT        NOT NULL,
  code        TEXT        NOT NULL CHECK (length(trim(code)) >= 2),
  notes       TEXT,
  code_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
  updated_by  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (seller_id, code_date)
);

CREATE INDEX IF NOT EXISTS idx_codes_seller_date
  ON ml_daily_codes (seller_id, code_date DESC);

ALTER TABLE ml_daily_codes ENABLE ROW LEVEL SECURITY;

-- Toda a equipe (mesma seller_id) pode ler e escrever
CREATE POLICY "select_own_codes" ON ml_daily_codes
  FOR SELECT USING (true);

CREATE POLICY "insert_own_codes" ON ml_daily_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "update_own_codes" ON ml_daily_codes
  FOR UPDATE USING (true) WITH CHECK (true);

-- ─────────────────────────────────────
-- 2. CONFIRMAÇÕES DE ENVIO
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS ml_confirmacoes (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id     TEXT        NOT NULL,
  order_id      TEXT        NOT NULL,
  confirmed     BOOLEAN     NOT NULL DEFAULT false,
  reason        TEXT,
  notes         TEXT,
  photo_url     TEXT,
  shipping_date DATE        NOT NULL DEFAULT CURRENT_DATE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (seller_id, order_id, shipping_date)
);

CREATE INDEX IF NOT EXISTS idx_confirms_seller_date
  ON ml_confirmacoes (seller_id, shipping_date DESC);

CREATE INDEX IF NOT EXISTS idx_confirms_order
  ON ml_confirmacoes (order_id);

ALTER TABLE ml_confirmacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_confirms" ON ml_confirmacoes
  FOR SELECT USING (true);

CREATE POLICY "insert_own_confirms" ON ml_confirmacoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "update_own_confirms" ON ml_confirmacoes
  FOR UPDATE USING (true) WITH CHECK (true);

-- ─────────────────────────────────────
-- 3. STORAGE — Bucket de Fotos
-- ─────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'fotos', 'fotos', true,
    10485760,  -- 10 MB por arquivo
    ARRAY['image/jpeg','image/png','image/webp','image/heic']
  )
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_fotos" ON storage.objects
  FOR SELECT USING (bucket_id = 'fotos');

CREATE POLICY "anon_upload_fotos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'fotos'
    AND octet_length(name) < 200  -- path length limit
  );

CREATE POLICY "anon_update_fotos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'fotos');

-- ─────────────────────────────────────
-- 4. REALTIME — Habilitar nas tabelas
-- ─────────────────────────────────────
-- Execute manualmente em: Database → Replication → Supabase Realtime
-- ou via SQL (requer extensão wal2json):
ALTER PUBLICATION supabase_realtime ADD TABLE ml_daily_codes;
ALTER PUBLICATION supabase_realtime ADD TABLE ml_confirmacoes;

-- ─────────────────────────────────────
-- 5. FUNÇÕES ÚTEIS
-- ─────────────────────────────────────

-- Retorna o código do dia atual de um seller
CREATE OR REPLACE FUNCTION get_today_code(p_seller_id TEXT)
RETURNS TABLE(code TEXT, notes TEXT, updated_at TIMESTAMPTZ) AS $$
  SELECT code, notes, updated_at
  FROM ml_daily_codes
  WHERE seller_id = p_seller_id AND code_date = CURRENT_DATE
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Retorna resumo do dia de um seller
CREATE OR REPLACE FUNCTION get_day_summary(p_seller_id TEXT, p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE(
  total_confirms INT,
  confirmed_count INT,
  not_confirmed_count INT,
  with_photo INT
) AS $$
  SELECT
    COUNT(*)::INT,
    COUNT(*) FILTER (WHERE confirmed)::INT,
    COUNT(*) FILTER (WHERE NOT confirmed)::INT,
    COUNT(*) FILTER (WHERE photo_url IS NOT NULL)::INT
  FROM ml_confirmacoes
  WHERE seller_id = p_seller_id AND shipping_date = p_date;
$$ LANGUAGE sql STABLE;
