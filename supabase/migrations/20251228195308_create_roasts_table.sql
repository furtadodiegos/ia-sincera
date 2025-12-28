-- Tabela para salvar os dramas e respostas da LLM
CREATE TABLE roasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drama TEXT NOT NULL CHECK (char_length(drama) <= 280),
  mode TEXT NOT NULL CHECK (mode IN ('tio_churrasco', 'coach_quantico', 'amigo_sincero')),
  roast_response TEXT NOT NULL,
  advice_response TEXT NOT NULL,
  closing_response TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index para queries de métricas
CREATE INDEX roasts_created_at_idx ON roasts(created_at DESC);

-- RLS desabilitado pois não há autenticação
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção anônima
CREATE POLICY "Allow anonymous insert" ON roasts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para permitir leitura anônima (para métricas)
CREATE POLICY "Allow anonymous read" ON roasts
  FOR SELECT
  TO anon
  USING (true);
