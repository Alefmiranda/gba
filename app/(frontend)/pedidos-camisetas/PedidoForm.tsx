'use client'

import { useState } from 'react'

const MODELOS = [
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'baby-look', label: 'Baby look' },
]
// provisório — ajusto quando vierem as fotos com os tamanhos
const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XG']

const inputClass =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30'

export function PedidoForm() {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [modelo, setModelo] = useState('')
  const [tamanho, setTamanho] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !whatsapp.trim() || !modelo || !tamanho) return
    setStatus('sending')
    try {
      const r = await fetch('/api/pedidos-camiseta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          whatsapp: whatsapp.trim(),
          modelo,
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
          Recebemos seu pedido de camiseta. Qualquer ajuste, a gente fala com você pelo WhatsApp.
        </p>
        <button
          onClick={() => {
            setNome(''); setWhatsapp(''); setModelo(''); setTamanho(''); setQuantidade(1); setObservacao(''); setStatus('idle')
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
        <div className="grid grid-cols-2 gap-3">
          {MODELOS.map((m) => {
            const sel = modelo === m.value
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setModelo(m.value)}
                className={`rounded-xl border p-4 text-left transition ${
                  sel ? 'border-brand-accent bg-brand-accent/10 ring-2 ring-brand-accent/30' : 'border-ink/15 bg-white hover:border-ink/30'
                }`}
              >
                {/* área da foto do modelo (entra quando você mandar as fotos) */}
                <div className="aspect-[4/3] rounded-lg bg-ink/5 mb-3 flex items-center justify-center overflow-hidden">
                  <span className="marker text-ink/30 text-[10px]">foto em breve</span>
                </div>
                <div className="display text-ink text-[17px] leading-tight">{m.label}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* TAMANHO */}
      <div>
        <label className="marker text-ink/55 text-[11px] block mb-3">Tamanho *</label>
        <div className="flex flex-wrap gap-2">
          {TAMANHOS.map((t) => {
            const sel = tamanho === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTamanho(t)}
                className={`min-w-[52px] rounded-lg border px-4 py-2.5 text-[15px] font-medium transition ${
                  sel ? 'border-brand-accent bg-brand-accent/15 text-brand' : 'border-ink/15 bg-white text-ink/80 hover:border-ink/30'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

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
        <textarea className={`${inputClass} min-h-[90px] resize-y`} value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Algum detalhe?" />
      </div>

      {status === 'err' && (
        <p className="text-[14px] text-red-600">Não consegui enviar. Confere os campos e tenta de novo.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !nome.trim() || !whatsapp.trim() || !modelo || !tamanho}
        className="w-full rounded-full bg-brand py-4 text-canvas text-[15px] font-semibold transition hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar pedido'}
      </button>
    </form>
  )
}
