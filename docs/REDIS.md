# Uso do Redis

Funções:

- Rate limit por IP
- Evitar respostas repetidas
- Cache das respostas mais curtidas

Chaves sugeridas:

- rl:{ip}
- recent:{hash_input}
- top:{mode}
