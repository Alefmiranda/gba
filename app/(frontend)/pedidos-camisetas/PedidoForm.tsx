'use client'

import { useState } from 'react'

// modelos + tamanhos + medidas (largura × comprimento, cm) — das tabelas Vellox
type Medida = [string, string, string] // [tamanho, largura, comprimento]
type Modelo = { value: string; label: string; sub?: string; medidas: Medida[] }

const MODELOS: Modelo[] = [
  {
    value: 'tradicional',
    label: 'Tradicional',
    sub: 'masculina / unissex',
    medidas: [
      ['PP', '48', '66'], ['P', '50,5', '69'], ['M', '53', '71'],
      ['G', '55,5', '73'], ['GG', '58', '75'], ['EXGG', '61', '78'],
    ],
  },
  {
    value: 'baby-look',
    label: 'Baby look',
    sub: 'feminina',
    medidas: [['P', '42', '56,9'], ['M', '43,5', '62,5'], ['G', '45,5', '64,5'], ['GG', '48,5', '66,5']],
  },
  {
    value: 'regata-masculina',
    label: 'Regata masculina',
    medidas: [['P', '49', '65'], ['M', '52', '70,5'], ['G', '54,5', '74,5'], ['GG', '57', '79']],
  },
  {
    value: 'regata-feminina',
    label: 'Regata feminina',
    medidas: [['P', '36,5', '59,5'], ['M', '40', '63'], ['G', '42,5', '65,5'], ['GG', '45,5', '67,5']],
  },
  {
    value: 'tamanho-especial',
    label: 'Tamanho especial',
    sub: 'plus size',
    medidas: [['G1', '63', '80'], ['G2', '66', '82'], ['G3', '68', '88']],
  },
  {
    value: 'infantil',
    label: 'Infantil',
    sub: '2 a 14 anos',
    medidas: [['2 anos', '', ''], ['4 anos', '', ''], ['6 anos', '', ''], ['8 anos', '', ''], ['10 anos', '', ''], ['12 anos', '', ''], ['14 anos', '', '']],
  },
]

const inputClass =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30'

export function PedidoForm() {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [modeloVal, setModeloVal] = useState('')
  const [tamanho, setTamanho] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')
  const [verMedidas, setVerMedidas] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const modelo = MODELOS.find((m) => m.value === modeloVal)
  const temMedidas = modelo?.medidas.some((m) => m[1]) ?? false

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !whatsapp.trim() || !modeloVal || !tamanho) return
    setStatus('sending')
    try {
      const r = await fetch('/api/pedidos-camiseta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          whatsapp: whatsapp.trim(),
          modelo: modelo?.label || modeloVal,
          tamanho,
          quantidade: Math.max(1, Number(quantidade) || 1),
          observacao: observacao.trim() || undefined,
        }),
      })
      if (!r.ok) throw new Error('fail')
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'ok') {
    return (
      <div className="text-center py-10">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand-accent/20">
          <svg viewBox="0 0 24 24" fill="none" className="size-8 text-brand">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="display text-ink text-[26px] leading-tight">Pedido enviado! ✅</h2>
        <p className="mt-3 text-ink/70 text-[16px] leading-[1.5]">
          Recebemos seu pedido. Qualquer ajuste, a gente fala com você pelo WhatsApp.
        </p>
        <button
          onClick={() => {
            setNome(''); setWhatsapp(''); setModeloVal(''); setTamanho(''); setQuantidade(1); setObservacao(''); setStatus('idle')
          }}
          className="mt-8 marker text-brand-accent text-[11px] hover:text-brand transition"
        >
          Fazer outro pedido ↗
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      {/* MODELO */}
      <div>
        <label className="marker text-ink/55 text-[11px] block mb-3">Modelo *</label>
        <div className="grid grid-cols-2 gap-2.5">
          {MODELOS.map((m) => {
            const sel = modeloVal === m.value
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => { setModeloVal(m.value); setTamanho(''); setVerMedidas(false) }}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  sel ? 'border-brand-accent bg-brand-accent/10 ring-2 ring-brand-accent/30' : 'border-ink/15 bg-white hover:border-ink/30'
                }`}
              >
                <div className="display text-ink text-[15px] leading-tight">{m.label}</div>
                {m.sub && <div className="marker text-ink/40 text-[9px] mt-1">{m.sub}</div>}
              </button>
            )
          })}
        </div>
      </div>

      {/* TAMANHO (depende do modelo) */}
      {modelo && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="marker text-ink/55 text-[11px]">Tamanho *</label>
            {temMedidas && (
              <button type="button" onClick={() => setVerMedidas((v) => !v)} className="marker text-brand-accent text-[10px] hover:text-brand transition">
                {verMedidas ? 'fechar medidas' : 'ver medidas ↓'}
              </button>
            )}
          </div>

          {verMedidas && temMedidas && (
            <div className="mb-3 rounded-xl border border-ink/10 bg-ink/[0.03] p-3 overflow-x-auto">
              <table className="w-full text-[13px] text-ink/75">
                <thead>
                  <tr className="text-ink/45 marker text-[9px]">
                    <th className="text-left font-normal pb-1">Tam</th>
                    <th className="text-left font-normal pb-1">Largura</th>
                    <th className="text-left font-normal pb-1">Comprimento</th>
                  </tr>
                </thead>
                <tbody>
                  {modelo.medidas.map((m) => (
                    <tr key={m[0]}>
                      <td className="py-0.5 font-medium text-ink">{m[0]}</td>
                      <td className="py-0.5">{m[1]} cm</td>
                      <td className="py-0.5">{m[2]} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {modelo.medidas.map((m) => {
              const t = m[0]
              const sel = tamanho === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTamanho(t)}
                  className={`rounded-lg border px-4 py-2.5 text-[15px] font-medium transition ${
                    sel ? 'border-brand-accent bg-brand-accent/15 text-brand' : 'border-ink/15 bg-white text-ink/80 hover:border-ink/30'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* QUANTIDADE */}
      <div>
        <label className="marker text-ink/55 text-[11px] block mb-3">Quantidade *</label>
        <div className="inline-flex items-center rounded-xl border border-ink/15 bg-white">
          <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} className="size-11 text-[20px] text-ink/60 hover:text-ink transition" aria-label="Menos">−</button>
          <span className="w-12 text-center text-[17px] font-medium tabular-nums">{quantidade}</span>
          <button type="button" onClick={() => setQuantidade((q) => q + 1)} className="size-11 text-[20px] text-ink/60 hover:text-ink transition" aria-label="Mais">+</button>
        </div>
      </div>

      {/* NOME */}
      <div>
        <label className="marker text-ink/55 text-[11px] block mb-2">Nome completo *</label>
        <input className={inputClass} value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome" />
      </div>

      {/* WHATSAPP */}
      <div>
        <label className="marker text-ink/55 text-[11px] block mb-2">WhatsApp *</label>
        <input className={inputClass} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required inputMode="tel" placeholder="(62) 99999-9999" />
      </div>

      {/* OBSERVAÇÃO */}
      <div>
        <label className="marker text-ink/55 text-[11px] block mb-2">Observações (opcional)</label>
        <textarea className={`${inputClass} min-h-[80px] resize-y`} value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Algum detalhe?" />
      </div>

      {status === 'err' && (
        <p className="text-[14px] text-red-600">Não consegui enviar. Confere os campos e tenta de novo.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !nome.trim() || !whatsapp.trim() || !modeloVal || !tamanho}
        className="w-full rounded-full bg-brand py-4 text-canvas text-[15px] font-semibold transition hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar pedido'}
      </button>
    </form>
  )
}
