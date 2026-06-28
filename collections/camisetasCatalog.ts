// Catálogo de modelos e tamanhos das camisetas (fornecedor VELLOX).
// Fonte única de verdade — usado tanto pela collection do admin quanto pelo
// formulário público de pedidos. Mantém os dois SEMPRE em sincronia.

export type ModeloCamiseta = {
  /** valor salvo no banco */
  value: string
  /** rótulo exibido no admin e no formulário */
  label: string
  /** tamanhos disponíveis pra esse modelo */
  tamanhos: string[]
}

export const MODELOS_CAMISETA: ModeloCamiseta[] = [
  {
    value: 'masculina-adulto',
    label: 'Camiseta Masculina Adulto',
    tamanhos: ['PP', 'P', 'M', 'G', 'GG', 'EXGG'],
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
    value: 'adulto-especial',
    label: 'Camiseta Adulto Tamanho Especial',
    tamanhos: ['G1', 'G2', 'G3'],
  },
  {
    value: 'infantil',
    label: 'Camiseta Infantil',
    tamanhos: ['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos', '14 anos'],
  },
]

/** Opções { label, value } dos modelos — pra select do Payload. */
export const MODELO_OPTIONS = MODELOS_CAMISETA.map((m) => ({
  label: m.label,
  value: m.value,
}))

/** União de TODOS os tamanhos (distintos, na ordem) — pra select do Payload. */
export const TODOS_TAMANHOS: string[] = (() => {
  const vistos = new Set<string>()
  const out: string[] = []
  for (const m of MODELOS_CAMISETA) {
    for (const t of m.tamanhos) {
      if (!vistos.has(t)) {
        vistos.add(t)
        out.push(t)
      }
    }
  }
  return out
})()

export const TAMANHO_OPTIONS = TODOS_TAMANHOS.map((t) => ({ label: t, value: t }))

/** Rótulo legível de um modelo a partir do value salvo. */
export function modeloLabel(value: string | null | undefined): string {
  return MODELOS_CAMISETA.find((m) => m.value === value)?.label ?? String(value ?? '')
}

/** Tamanhos válidos pra um modelo (vazio se o modelo não existir). */
export function tamanhosDoModelo(value: string | null | undefined): string[] {
  return MODELOS_CAMISETA.find((m) => m.value === value)?.tamanhos ?? []
}
