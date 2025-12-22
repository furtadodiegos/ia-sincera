# API (Cloudflare Worker)

## POST /generate

Gera um roast + conselho.

Body:
{
"input": "texto do usuário",
"mode": "tio_churrasco | coach_quantico | amigo_sincero"
}

Response:
{
"roast": "...",
"advice": "...",
"closing": "..."
}

Observações:

- aplicar rate limit
- validar tamanho do input
- rodar moderação antes de salvar
