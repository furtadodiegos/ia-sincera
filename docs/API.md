# API

## Endpoints

### POST /api/roast

Gera um roast para o drama do amigo.

Request:
```json
{
  "drama": "Meu amigo terminou com a namorada e agora só ouve Adele",
  "mode": "tio_churrasco"
}
```

Response:
```json
{
  "roast": "Ah, o clássico...",
  "advice": "Manda ele ouvir sertanejo...",
  "closing": "Boa sorte aí, vai precisar.",
  "response_time_ms": 1234
}
```

Modos disponíveis:
- `tio_churrasco` - Senso comum e opiniões vagas
- `coach_quantico` - Motivação vazia e buzzwords
- `amigo_sincero` - Direto, empático, ironia leve

Validações:
- Max 280 caracteres no drama
- Moderação via Worker (bloqueia violência, crime, ódio)
- Fallback para humor neutro se moderação falhar

### GET /api/metrics

Retorna métricas para a página /status.

Response:
```json
{
  "total_roasts": 1234,
  "avg_response_time_ms": 890,
  "roasts_last_24h": 56,
  "roasts_last_7d": 420,
  "mode_distribution": {
    "tio_churrasco": 500,
    "coach_quantico": 400,
    "amigo_sincero": 334
  }
}
```

## Worker (Cloudflare)

### POST /moderate

Verifica se conteúdo é apropriado antes de enviar à LLM.

Request:
```json
{
  "content": "texto do drama"
}
```

Response:
```json
{
  "allowed": true,
  "reason": null
}
```

ou

```json
{
  "allowed": false,
  "reason": "conteúdo inapropriado"
}
```

### POST /generate

Chama a LLM para gerar a resposta.

Request:
```json
{
  "drama": "texto do drama",
  "mode": "tio_churrasco"
}
```

Response:
```json
{
  "roast": "...",
  "advice": "...",
  "closing": "..."
}
```
