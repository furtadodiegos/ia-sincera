# Depoimentos — Rede Social de Perfis Coletivos

Uma rede social onde **seu perfil é construído pelo que seus amigos escrevem sobre você**.

---

## Conceito

Ao invés de você falar de si mesmo, seus amigos constroem sua identidade pública através de depoimentos curtos. O resultado é um "mosaico social" que reflete como você é visto pelos outros.

**Diferenciais:**
- Conteúdo autêntico (não é você falando de você)
- Viralidade natural (amigos querem ver o que outros escreveram)
- Zero fricção (compartilha link → recebe depoimentos)

---

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Autenticação |
| `/[username]` | Perfil público |

> A experiência muda baseada no contexto: dono do perfil vs visitante.

---

## Entidades

### User
- `id` — identificador único
- `username` — slug do perfil (único)
- `about` — descrição curta (opcional)
- `created_at` — data de criação

### Testimonial (depoimento)
- `id` — identificador único
- `author_id` — quem escreveu (User)
- `profile_id` — perfil que recebeu (User)
- `content` — texto (máx. 140 caracteres)
- `created_at` — data de criação

**Regra:** 1 depoimento por autor por perfil.

---

## Fluxos

### Dono do Perfil (`/[me]`)

**Visualiza:**
- Seu "about me"
- Lista de depoimentos recebidos
- Preview do perfil público

**Ações:**
- Editar about me
- Compartilhar link do perfil
- Excluir conta

### Visitante (`/[friend]`)

**Visualiza:**
- About me do amigo
- Depoimentos de outras pessoas

**Ações:**
- Escrever depoimento (se ainda não escreveu)
- Compartilhar perfil

---

## Regras do MVP

| Regra | Motivo |
|-------|--------|
| 1 depoimento por amigo | Evita spam |
| Máx. 140 caracteres | Força qualidade |
| Sem respostas a depoimentos | Não vira fórum |
| Sem edição de depoimentos | Mantém autenticidade |

---

## Moderação

Bloquear:
- Ódio e discriminação
- Ameaças e assédio
- Doxxing
- Conteúdo sexual explícito

Fallback: recusar envio com mensagem amigável.

---

## Fluxo Principal

```
1. Login → define about me
2. Compartilha link do perfil
3. Amigos deixam depoimentos
4. Perfil vira mosaico social
5. Amigos compartilham também (viral)
```

---

## Por que funciona

- Curiosidade social (o que escreveram sobre mim?)
- Efeito rede (cada visitante pode virar autor)
- Baixa barreira de entrada (só precisa escrever 140 chars)
- Conteúdo único (não replicável em outras redes)
