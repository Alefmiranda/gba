'use client'

// Topo da lista de Pedidos: escolhe o lote e baixa em CSV (abre no Excel).
import React, { useEffect, useState } from 'react'

type Lote = { id: string | number; nome?: string; ativo?: boolean }
type Pedido = {
  nome?: string
  whatsapp?: string
  camiseta?: string
  modelo?: string
  tamanho?: string
  quantidade?: number
  observacao?: string
  createdAt?: string
  lote?: { nome?: string } | string | number | null
}

function cell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function ExportPedidosButton() {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [loteId, setLoteId] = useState<string>('') // '' = todos
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lotes?limit=100&sort=-createdAt&depth=0', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        const ls: Lote[] = d.docs || []
        setLotes(ls)
        const ativo = ls.find((l) => l.ativo)
        if (ativo) setLoteId(String(ativo.id))
      })
      .catch(() => {})
  }, [])

  const baixar = async () => {
    setLoading(true)
    setMsg(null)
    try {
      let url = '/api/pedidos-camiseta?limit=5000&depth=1&sort=-createdAt'
      if (loteId) url += `&where[lote][equals]=${loteId}`
      const r = await fetch(url, { credentials: 'include' })
      if (!r.ok) throw new Error('fetch')
      const data = await r.json()
      const docs: Pedido[] = data.docs || []
      if (!docs.length) {
        setMsg('Nenhum pedido neste lote ainda.')
        return
      }
      const header = ['Lote', 'Nome', 'WhatsApp', 'Camiseta', 'Modelo', 'Tamanho', 'Quantidade', 'Observações', 'Data']
      const rows = docs.map((d) => {
        const loteNome = d.lote && typeof d.lote === 'object' ? d.lote.nome : ''
        return [
          loteNome,
          d.nome,
          d.whatsapp,
          d.camiseta,
          d.modelo,
          d.tamanho,
          d.quantidade,
          d.observacao,
          d.createdAt ? new Date(d.createdAt).toLocaleString('pt-BR') : '',
        ]
          .map(cell)
          .join(',')
      })
      const csv = '﻿' + [header.join(','), ...rows].join('\n') // BOM = acentos certos no Excel
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const dl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const loteSlug = loteId
        ? (lotes.find((l) => String(l.id) === loteId)?.nome || 'lote').replace(/[^\w-]+/g, '-').toLowerCase()
        : 'todos'
      a.href = dl
      a.download = `pedidos-${loteSlug}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(dl)
      setMsg(`${docs.length} pedido(s) exportado(s).`)
    } catch {
      setMsg('Erro ao gerar. Recarregue a página e tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '8px 0 20px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <select
        value={loteId}
        onChange={(e) => setLoteId(e.target.value)}
        style={{ padding: '9px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', fontSize: 13 }}
      >
        <option value="">Todos os lotes</option>
        {lotes.map((l) => (
          <option key={String(l.id)} value={String(l.id)}>
            {l.nome}
            {l.ativo ? ' (ativo)' : ''}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={baixar}
        disabled={loading}
        style={{
          background: '#053A44',
          color: '#fff',
          border: 0,
          borderRadius: 6,
          padding: '10px 18px',
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? 'wait' : 'pointer',
        }}
      >
        {loading ? 'Gerando…' : '⬇  Baixar lista (CSV) pro fornecedor'}
      </button>
      {msg && <span style={{ fontSize: 13, opacity: 0.7 }}>{msg}</span>}
    </div>
  )
}
