# Supabase Schema

## Table: advices

Armazena respostas geradas.

- id (uuid)
- input_text (text)
- mode (text)
- roast (text)
- advice (text)
- closing (text)
- likes (int, default 0)
- created_at (timestamp)

## Table: shares

Links compartilháveis.

- id (uuid)
- advice_id (uuid, fk advices.id)
- slug (text, unique)
- created_at (timestamp)

Observações:

- Auth é opcional no MVP
- Pode usar RLS simples ou nenhum no começo
