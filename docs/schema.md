# Database Schema

## Tables

### roasts

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| drama | text | NOT NULL, max 140 chars |
| mode | text | NOT NULL, enum (tio_churrasco, coach_quantico, amigo_sincero) |
| roast_response | text | NOT NULL |
| advice_response | text | NOT NULL |
| closing_response | text | NOT NULL |
| response_time_ms | integer | NOT NULL |
| created_at | timestamptz | NOT NULL, default now() |

## Indexes

```sql
CREATE INDEX roasts_created_at_idx ON roasts(created_at DESC);
```

## RLS Policies

### roasts
- INSERT: anonimo permitido
- SELECT: anonimo permitido (para metricas)
- UPDATE: nao permitido
- DELETE: nao permitido

## Functions

| Function | Returns | Description |
|----------|---------|-------------|
| get_basic_metrics() | total_roasts, avg_response_time_ms | Metricas basicas |
| get_roast_metrics() | total, avg, last_24h, last_7d, distribution | Metricas completas |
