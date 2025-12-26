# API

## Endpoints (via Supabase + Worker)

### Perfil

#### GET /api/profile/[username]
Retorna perfil público com depoimentos.

Response:
```json
{
  "user": {
    "username": "diego",
    "display_name": "Diego",
    "about": "dev @ somewhere",
    "avatar_url": "..."
  },
  "testimonials": [
    {
      "id": "...",
      "author": { "username": "ana", "display_name": "Ana" },
      "content": "Melhor dev que já conheci!",
      "created_at": "2025-01-01T..."
    }
  ],
  "can_write": true
}
```

`can_write`: indica se o usuário logado pode escrever depoimento.

#### PATCH /api/profile
Atualiza about me (autenticado).

Body:
```json
{
  "about": "nova descrição"
}
```

### Depoimentos

#### POST /api/testimonial
Cria depoimento (autenticado).

Body:
```json
{
  "profile_id": "uuid-do-perfil",
  "content": "texto do depoimento"
}
```

Validações:
- Max 140 caracteres
- Moderação via Worker
- 1 por autor por perfil

#### DELETE /api/testimonial/[id]
Remove depoimento (autor ou dono do perfil).

### Auth

Gerenciado pelo Supabase Auth:
- `/api/auth/callback` — OAuth callback
- `/api/auth/signout` — Logout

## Worker (Cloudflare)

### POST /moderate
Verifica se conteúdo é apropriado.

Body:
```json
{
  "content": "texto do depoimento"
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
