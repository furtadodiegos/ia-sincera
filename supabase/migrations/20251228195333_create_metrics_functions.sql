-- Função para obter métricas agregadas
CREATE OR REPLACE FUNCTION get_roast_metrics()
RETURNS TABLE (
  total_roasts BIGINT,
  avg_response_time_ms NUMERIC,
  roasts_last_24h BIGINT,
  roasts_last_7d BIGINT,
  mode_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_roasts,
    ROUND(AVG(r.response_time_ms)::NUMERIC, 2) AS avg_response_time_ms,
    COUNT(*) FILTER (WHERE r.created_at > NOW() - INTERVAL '24 hours')::BIGINT AS roasts_last_24h,
    COUNT(*) FILTER (WHERE r.created_at > NOW() - INTERVAL '7 days')::BIGINT AS roasts_last_7d,
    COALESCE(
      jsonb_object_agg(r.mode, mode_count) FILTER (WHERE r.mode IS NOT NULL),
      '{}'::JSONB
    ) AS mode_distribution
  FROM roasts r
  LEFT JOIN LATERAL (
    SELECT r.mode, COUNT(*) AS mode_count
    FROM roasts
    WHERE mode = r.mode
    GROUP BY mode
  ) modes ON true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função simplificada para métricas básicas
CREATE OR REPLACE FUNCTION get_basic_metrics()
RETURNS TABLE (
  total_roasts BIGINT,
  avg_response_time_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    ROUND(AVG(response_time_ms)::NUMERIC, 2)
  FROM roasts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir execução anônima das funções
GRANT EXECUTE ON FUNCTION get_roast_metrics() TO anon;
GRANT EXECUTE ON FUNCTION get_basic_metrics() TO anon;
