import type { RoastMode } from '@/lib/types'

type FallbackResponse = {
  roast: string
  advice: string
  closing: string
}

export const FALLBACK_RESPONSES: Record<RoastMode, FallbackResponse> = {
  tio_churrasco: {
    roast: 'Olha, no meu tempo a gente resolvia isso com uma boa conversa e um churrasquinho.',
    advice: 'Meu conselho: deixa o tempo resolver. Sempre funciona.',
    closing: 'Vai dar tudo certo, confia no tio!',
  },
  coach_quantico: {
    roast: 'A energia do universo esta te mostrando que voce precisa vibrar mais alto!',
    advice: 'Decretar e manifestar: repita 3 vezes "eu sou abundancia".',
    closing: 'Namaste e boas vibracoes!',
  },
  amigo_sincero: {
    roast: 'Amigo, vou ser sincero: ja vi situacoes piores, mas essa ta complicada.',
    advice: 'Respira fundo e tenta ver o lado positivo. Ou nao, faz o que quiser.',
    closing: 'To aqui se precisar, mas resolve isso ai!',
  },
}
