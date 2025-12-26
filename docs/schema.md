# Database Schema

## Tables

### users

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| username | text | UNIQUE, NOT NULL |
| display_name | text | |
| about | text | max 280 chars |
| avatar_url | text | |
| created_at | timestamptz | default now() |

### testimonials

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| author_id | uuid | FK users.id, NOT NULL |
| profile_id | uuid | FK users.id, NOT NULL |
| content | text | max 140 chars, NOT NULL |
| created_at | timestamptz | default now() |

**Constraint:** UNIQUE(author_id, profile_id) — 1 depoimento por autor por perfil.

## Indexes

```sql
CREATE INDEX idx_testimonials_profile ON testimonials(profile_id);
CREATE INDEX idx_testimonials_author ON testimonials(author_id);
CREATE INDEX idx_users_username ON users(username);
```

## RLS Policies

### users
- SELECT: público
- UPDATE: apenas próprio perfil
- DELETE: apenas próprio perfil

### testimonials
- SELECT: público
- INSERT: usuário autenticado (author_id = auth.uid())
- DELETE: autor ou dono do perfil
