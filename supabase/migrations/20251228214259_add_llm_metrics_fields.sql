-- Campos adicionais para métricas de LLM
ALTER TABLE roasts
  ADD COLUMN input_tokens INTEGER,
  ADD COLUMN output_tokens INTEGER,
  ADD COLUMN model_version TEXT,
  ADD COLUMN was_moderated BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN moderation_reason TEXT;

-- Index para queries de moderação
CREATE INDEX roasts_was_moderated_idx ON roasts(was_moderated) WHERE was_moderated = true;

-- Comentários para documentação
COMMENT ON COLUMN roasts.input_tokens IS 'Tokens enviados para a LLM';
COMMENT ON COLUMN roasts.output_tokens IS 'Tokens recebidos da LLM';
COMMENT ON COLUMN roasts.model_version IS 'Versão/ID do modelo usado (ex: gpt-4o-mini)';
COMMENT ON COLUMN roasts.was_moderated IS 'Se o conteúdo foi bloqueado pela moderação';
COMMENT ON COLUMN roasts.moderation_reason IS 'Motivo do bloqueio quando was_moderated=true';
