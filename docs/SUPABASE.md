# Supabase

## Tables

### roasts

```sql
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

CREATE INDEX roasts_created_at_idx ON roasts(created_at DESC);
```

## RLS Policies

```sql
-- RLS habilitado
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;

-- Insercao anonima permitida
CREATE POLICY "Allow anonymous insert" ON roasts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Leitura anonima permitida (para metricas)
CREATE POLICY "Allow anonymous read" ON roasts
  FOR SELECT
  TO anon
  USING (true);
```

## Functions

### get_basic_metrics()

Retorna metricas basicas.

```sql
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
```

### get_roast_metrics()

Retorna metricas completas.

```sql
CREATE OR REPLACE FUNCTION get_roast_metrics()
RETURNS TABLE (
  total_roasts BIGINT,
  avg_response_time_ms NUMERIC,
  roasts_last_24h BIGINT,
  roasts_last_7d BIGINT,
  mode_distribution JSONB
) AS $$
...
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Permissoes

```sql
GRANT EXECUTE ON FUNCTION get_roast_metrics() TO anon;
GRANT EXECUTE ON FUNCTION get_basic_metrics() TO anon;
```
