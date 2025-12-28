# UX Guidelines

## Principios

- Simples e direto
- Zero friccao (sem login)
- Foco no humor
- Compartilhamento obvio

## Regras

### Landing Page

- Titulo chamativo
- Subtitulo explicando o app
- Input centralizado com placeholder
- Selector de modo visivel
- Botao de acao claro

### Input de Drama

- Textarea com contador de caracteres
- Limite visual (280/280)
- Placeholder sugestivo
- Botao desabilitado se vazio ou exceder limite

### Selector de Modo

- 3 opcoes visiveis (cards ou tabs)
- Descricao curta de cada modo
- Modo padrao pre-selecionado

### Resposta

Exibir em formato claro:

```
ROAST
[texto do roast]

CONSELHO
[texto do conselho]

FECHAMENTO
[texto do fechamento]
```

- Animacao de loading durante geracao
- Botao de compartilhar apos resposta
- Botao de "tentar novamente"

### Compartilhamento

- Botao de share sempre visivel apos resposta
- Suporte a Web Share API (mobile)
- Fallback: copiar texto

### Responsividade

- Mobile-first
- Input legivel sem scroll horizontal
- Touch targets minimo 44px

## Estados

### Inicial

- Input vazio
- Modo padrao selecionado
- Botao desabilitado

### Carregando

- Input desabilitado
- Spinner ou skeleton
- Mensagem de loading divertida

### Sucesso

- Resposta formatada
- Botoes de acao (share, retry)

### Erro

- Mensagem amigavel
- Opcao de tentar novamente
- Fallback para humor neutro
