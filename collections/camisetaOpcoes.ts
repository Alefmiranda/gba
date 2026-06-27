// Opções de camiseta da equipe — fonte ÚNICA de verdade (tabela da VELLOX).
// Usado tanto pelas collections do Payload quanto pelo formulário público,
// pra modelo e tamanho nunca saírem de sincronia.

export type ModeloCamiseta = {
  value: string
  label: string
  tamanhos: string[]
}

export const MODELOS_CAMISETA: ModeloCamiseta[] = [
  {
    value: 'masculina-adulto',
    label: 'Camiseta Masculina Adulto',
    tamanhos: ['PP', 'P', 'M', 'G', 'GG', 'EXGG'],
  },
  {
    value: 'adulto-especial',
    label: 'Camiseta Adulto · Tamanho Especial',
    tamanhos: ['G1', 'G2', 'G3'],
  },
  {
    value: 'baby-look-feminino',
    label: 'Baby Look Feminino',
    tamanhos: ['P', 'M', 'G', 'GG'],
  },
  {
    value: 'regata-feminina',
    label: 'Regata Feminina',
    tamanhos: ['P', 'M', 'G', 'GG'],
  },
  {
    value: 'regata-masculina',
    label: 'Regata Masculina',
    tamanhos: ['P', 'M', 'G', 'GG'],
  },
  {
    value: 'infantil',
    label: 'Camiseta Infantil',
    tamanhos: ['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos', '14 anos'],
  },
]

/** Opções {label,value} dos modelos — pro select do Payload. */
export const MODELO_OPTIONS = MODELOS_CAMISETA.map((m) => ({ label: m.label, value: m.value }))

/** União de todos os tamanhos possíveis — pro select do Payload (admin vê o valor cru). */
export const TODOS_TAMANHOS: string[] = Array.from(
  new Set(MODELOS_CAMISETA.flatMap((m) => m.tamanhos)),
)

/** Label legível de um modelo a partir do value (fallback: o próprio value). */
export function labelModelo(value: string): string {
  return MODELOS_CAMISETA.find((m) => m.value === value)?.label ?? value
}

/** Valida se um par modelo+tamanho existe na tabela. */
export function tamanhoValido(modelo: string, tamanho: string): boolean {
  return Boolean(MODELOS_CAMISETA.find((m) => m.value === modelo)?.tamanhos.includes(tamanho))
}
