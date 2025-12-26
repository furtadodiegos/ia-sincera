# UX Guidelines

## Princípios

- Leitura rápida
- Zero fricção
- Foco no conteúdo (depoimentos)
- Compartilhamento óbvio

## Regras

### Perfil

- About me sempre visível no topo
- Depoimentos em lista vertical
- Ordenação: mais recentes primeiro
- Cada depoimento mostra: autor + texto + data

### Input de Depoimento

- Textarea com contador de caracteres
- Limite visual (140/140)
- Botão desabilitado se vazio ou exceder limite
- Feedback de sucesso/erro imediato

### Compartilhamento

- Botão de share sempre visível
- Suporte a Web Share API (mobile)
- Fallback: copiar link

### Responsividade

- Mobile-first
- Perfil legível sem scroll horizontal
- Touch targets mínimo 44px

## Estados

### Perfil vazio (sem depoimentos)

- Mensagem convidativa
- CTA para compartilhar link

### Visitante não logado

- Pode ver perfil
- Prompt para login ao tentar escrever

### Visitante já escreveu

- Input desabilitado
- Mostra seu depoimento destacado
