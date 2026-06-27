'use client'

import { useActionState, useState } from 'react'
import { MODELOS_CAMISETA } from '@/collections/camisetaOpcoes'
import { criarPedido, type PedidoState } from './actions'

const inputBase =
  'w-full h-12 rounded-lg border border-ink/15 bg-surface px-4 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-accent/40'
const labelBase = 'marker text-ink/50 text-[10px] mb-2 block'

export function PedidoForm({ cores }: { cores: string[] }) {
  const [state, formAction, pending] = useActionState<PedidoState, FormData>(criarPedido, {
    ok: false,
  })
  const [modelo, setModelo] = useState('')

  const tamanhos = MODELOS_CAMISETA.find((m) => m.value === modelo)?.tamanhos ?? []

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-ink/12 bg-surface p-8 lg:p-10 text-center">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-brand-accent text-ink text-[22px]">
          ✓
        </div>
        <h2 className="display text-ink text-[26px] lg:text-[30px] tracking-[-0.02em]">
          Pedido recebido!
        </h2>
        <p className="mt-3 text-ink/65 text-[15px] max-w-sm mx-auto">
          Anotamos seu pedido da camiseta da equipe. Em breve entramos em contato pelo WhatsApp pra
          confirmar os detalhes.
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-ink/12 bg-surface p-6 lg:p-8 flex flex-col gap-5"
    >
      <div>
        <label className={labelBase} htmlFor="nome">
          Nome completo
        </label>
        <input id="nome" name="nome" type="text" required className={inputBase} autoComplete="name" />
      </div>

      <div>
        <label className={labelBase} htmlFor="whatsapp">
          WhatsApp (com DDD)
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          placeholder="(62) 99999-9999"
          className={inputBase}
          autoComplete="tel"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelBase} htmlFor="modelo">
            Modelo
          </label>
          <select
            id="modelo"
            name="modelo"
            required
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className={inputBase}
          >
            <option value="" disabled>
              Selecione…
            </option>
            {MODELOS_CAMISETA.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelBase} htmlFor="tamanho">
            Tamanho
          </label>
          <select
            id="tamanho"
            name="tamanho"
            required
            disabled={!modelo}
            className={`${inputBase} disabled:opacity-50 disabled:cursor-not-allowed`}
            defaultValue=""
          >
            <option value="" disabled>
              {modelo ? 'Selecione…' : 'Escolha o modelo'}
            </option>
            {tamanhos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cores.length > 0 && (
          <div>
            <label className={labelBase} htmlFor="cor">
              Cor
            </label>
            <select id="cor" name="cor" required className={inputBase} defaultValue="">
              <option value="" disabled>
                Selecione…
              </option>
              {cores.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={cores.length > 0 ? '' : 'sm:col-span-2'}>
          <label className={labelBase} htmlFor="quantidade">
            Quantidade
          </label>
          <input
            id="quantidade"
            name="quantidade"
            type="number"
            min={1}
            defaultValue={1}
            required
            className={inputBase}
          />
        </div>
      </div>

      {state.error && (
        <p className="text-[14px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-1 inline-flex h-[52px] items-center justify-between gap-2 rounded-full bg-ink pl-6 pr-2 font-semibold text-[14px] text-canvas transition hover:bg-brand disabled:opacity-60"
      >
        <span>{pending ? 'Enviando…' : 'Enviar pedido'}</span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-accent text-ink transition group-hover:translate-x-0.5">
          →
        </span>
      </button>
    </form>
  )
}
