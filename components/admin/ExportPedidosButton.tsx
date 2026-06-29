'use client'

// Botão no topo da lista de Pedidos de camiseta: baixa tudo em CSV (abre no Excel).
import React, { useState } from 'react'

type Pedido = {
  nome?: string
  whatsapp?: string
  modelo?: string
  tamanho?: string
  quantidade?: number
  observacao?: string
  createdAt?: string
}

function cell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function ExportPedidosButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const baixar = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const r = await fetch('/api/pedidos-camiseta?limit=5000&depth=0&sort=-createdAt', {
        credentials: 'include',
      })
      if (!r.ok) throw new Error('fetch')
      const data = await r.json()
      const docs: Pedido[] = data.docs || []
      if (!docs.length) {
        setMsg('Nenhum pedido ainda.')
        return
      }
      const MODELO: Record<string, string> = { tradicional: 'Tradicional', 'baby-look': 'Baby look' }
      const header = ['Nome', 'WhatsApp', 'Modelo', 'Tamanho', 'Quantidade', 'Observações', 'Data']
      const rows = docs.map((d) =>
        [
          d.nome,
          d.whatsapp,
          MODELO[d.modelo || ''] || d.modelo,
          d.tamanho,
          d.quantidade,
          d.observacao,
          d.createdAt ? new Date(d.createdAt).toLocaleString('pt-BR') : '',
        ]
          .map(cell)
          .join(','),
      )
      const csv = '﻿' + [header.join(','), ...rows].join('\n') // BOM = acentos certos no Excel
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pedidos-camiseta-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMsg(`${docs.length} pedido(s) exportado(s).`)
    } catch {
      setMsg('Erro ao gerar. Recarregue a página e tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '8px 0 20px' }}>
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
      {msg && <span style={{ marginLeft: 12, fontSize: 13, opacity: 0.7 }}>{msg}</span>}
    </div>
  )
}
