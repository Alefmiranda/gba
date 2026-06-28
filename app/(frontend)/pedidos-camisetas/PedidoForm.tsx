'use client'

import { useMemo, useState } from 'react'
import { MODELOS_CAMISETA } from '@/collections/camisetasCatalog'

type Status = 'idle' | 'enviando' | 'ok' | 'erro'

const inputBase =
  'w-full rounded-xl border border-ink/15 bg-surface px-4 h-[52px] text-[15px] text-ink ' +
  'outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-accent/40 ' +
  'disabled:opacity-50'

const labelBase = 'block marker text-[10px] text-ink/55 mb-2'

export function PedidoForm() {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [modelo, setModelo] = useState('')
  const [tamanho, setTamanho] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [observacoes, setObservacoes] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [erro, setErro] = useState('')

  // tamanhos disponíveis pro modelo escolhido
  const tamanhos = useMemo(
    () => MODELOS_CAMISETA.find((m) => m.value === modelo)?.tamanhos ?? [],
    [modelo],
  )

  function resetar() {
    setNome('')
    setWhatsapp('')
    setModelo('')
    setTamanho('')
    setQuantidade(1)
    setObservacoes('')
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'enviando') return
    setErro('')

    if (!nome.trim() || !whatsapp.trim() || !modelo || !tamanho || quantidade < 1) {
      setErro('Preencha todos os campos obrigatórios.')
      setStatus('erro')
      return
    }

    setStatus('enviando')
    try {
      const res = await fetch('/api/pedidos-camiseta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          whatsapp: whatsapp.trim(),
          modelo,
          tamanho,
          quantidade,
          observacoes: observacoes.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error('falha')
      setStatus('ok')
      resetar()
    } catch {
      setErro('Não conseguimos enviar agora. Tente de novo em instantes.')
      setStatus('erro')
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl border border-brand/20 bg-brand-accent-soft p-8 lg:p-10">
        <div className="marker text-[10px] text-brand">Pedido recebido</div>
        <h2 className="mt-3 display text-ink text-[28px] lg:text-[32px] leading-tight">
          Prontinho! Seu pedido foi registrado. ✅
        </h2>
        <p className="mt-4 text-ink/70 text-[16px] leading-[1.5] max-w-md">
          Anotamos tudo aqui. Se precisar, a gente fala com você pelo WhatsApp informado.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-7 group inline-flex items-center justify-between gap-2 rounded-full font-semibold text-[14px] pl-6 pr-2 h-[52px] w-[250px] bg-ink text-canvas hover:bg-brand transition"
        >
          <span className="truncate">Fazer outro pedido</span>
          <span className="shrink-0 size-9 rounded-full flex items-center justify-center bg-brand-accent text-ink group-hover:translate-x-0.5 transition">
            →
          </span>
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="nome" className={labelBase}>
          Nome completo *
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoComplete="name"
          placeholder="Seu nome"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className={labelBase}>
          WhatsApp *
        </label>
        <input
          id="whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
          autoComplete="tel"
          placeholder="(62) 99999-9999"
          className={inputBase}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="modelo" className={labelBase}>
            Modelo *
          </label>
          <select
            id="modelo"
            value={modelo}
            onChange={(e) => {
              setModelo(e.target.value)
              setTamanho('') // zera o tamanho ao trocar de modelo
            }}
            required
            className={inputBase}
          >
            <option value="" disabled>
              Escolha o modelo
            </option>
            {MODELOS_CAMISETA.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tamanho" className={labelBase}>
            Tamanho *
          </label>
          <select
            id="tamanho"
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
            required
            disabled={!modelo}
            className={inputBase}
          >
            <option value="" disabled>
              {modelo ? 'Escolha o tamanho' : 'Escolha o modelo primeiro'}
            </option>
            {tamanhos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="quantidade" className={labelBase}>
          Quantidade *
        </label>
        <input
          id="quantidade"
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
          required
          className={`${inputBase} max-w-[140px]`}
        />
      </div>

      <div>
        <label htmlFor="observacoes" className={labelBase}>
          Observações
        </label>
        <textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={3}
          placeholder="Algum detalhe sobre o pedido? (opcional)"
          className="w-full rounded-xl border border-ink/15 bg-surface px-4 py-3 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-accent/40 resize-y"
        />
      </div>

      {erro ? (
        <p className="text-[14px] text-red-600 font-medium" role="alert">
          {erro}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'enviando'}
        className="group inline-flex items-center justify-between gap-2 rounded-full font-semibold text-[14px] pl-6 pr-2 h-[52px] w-[250px] bg-ink text-canvas hover:bg-brand transition disabled:opacity-60"
      >
        <span className="truncate">
          {status === 'enviando' ? 'Enviando…' : 'Enviar pedido'}
        </span>
        <span className="shrink-0 size-9 rounded-full flex items-center justify-center bg-brand-accent text-ink group-hover:translate-x-0.5 transition">
          →
        </span>
      </button>
    </form>
  )
}
