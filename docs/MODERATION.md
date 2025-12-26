# Moderação

## Objetivo

Evitar conteúdo ofensivo ou perigoso sem matar a autenticidade dos depoimentos.

## O que bloquear

- Ódio e discriminação
- Ameaças e incitação à violência
- Assédio e bullying
- Doxxing (dados pessoais)
- Conteúdo sexual explícito
- Spam e propaganda

## Implementação

### Via Cloudflare Worker

1. Depoimento enviado → Worker `/moderate`
2. Worker analisa conteúdo
3. Se aprovado → salva no Supabase
4. Se rejeitado → retorna erro amigável

### Fallback

Se moderação falhar (timeout, erro):
- Não salvar
- Pedir para tentar novamente

## Mensagens de Erro

| Situação | Mensagem |
|----------|----------|
| Conteúdo ofensivo | "Esse texto não rolou. Tenta algo mais leve?" |
| Spam detectado | "Parece spam. Escreve algo mais pessoal?" |
| Erro genérico | "Algo deu errado. Tenta de novo?" |

## Rate Limit

- Máximo 10 depoimentos por hora por usuário
- Máximo 100 requisições por minuto por IP
