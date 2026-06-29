'use client'

// Painel de controle no topo da lista de Pedidos: gerencia lotes (ativo / abrir
// novo / ativar) e baixa o CSV por lote. Tudo num lugar só.
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

const card: React.CSSProperties = {
  border: '1px solid rgba(14,14,12,0.1)',
  borderRadius: 12,
  background: '#fff',
  padding: 16,
}
const btnPrimary: React.CSSProperties = {
  background: '#053A44',
  color: '#fff',
  border: 0,
  borderRadius: 6,
  padding: '9px 16px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}
const btnGhost: React.CSSProperties = {
  background: 'transparent',
  color: '#053A44',
  border: '1px solid rgba(5,58,68,0.3)',
  borderRadius: 6,
  padding: '5px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
}
const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  borderRadius: 6,
  border: '1px solid rgba(0,0,0,0.15)',
  fontSize: 13,
  flex: 1,
  minWidth: 200,
}

export default function ExportPedidosButton() {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [novoNome, setNovoNome] = useState('')
  const [csvLoteId, setCsvLoteId] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const carregarLotes = async () => {
    try {
      const r = await fetch('/api/lotes?limit=200&sort=-createdAt&depth=0', { credentials: 'include' })
      if (!r.ok) return
      const d = await r.json()
      const ls: Lote[] = d.docs || []
      setLotes(ls)
      const ativo = ls.find((l) => l.ativo)
      setCsvLoteId(ativo ? String(ativo.id) : '')
    } catch {
      /* ignore */
    }
  }
  useEffect(() => {
    // setState ocorre após o await (assíncrono), não causa cascading render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarLotes()
  }, [])

  const ativo = lotes.find((l) => l.ativo)

  const criarLote = async () => {
    if (!novoNome.trim()) return
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch('/api/lotes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome.trim(), ativo: true }),
      })
      if (!r.ok) throw new Error()
      setNovoNome('')
      await carregarLotes()
      setMsg('✅ Lote criado e ativado. Os pedidos novos entram nele.')
    } catch {
      setMsg('Erro ao criar o lote.')
    } finally {
      setBusy(false)
    }
  }

  const ativarLote = async (id: string | number) => {
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch(`/api/lotes/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: true }),
      })
      if (!r.ok) throw new Error()
      await carregarLotes()
      setMsg('✅ Lote ativado.')
    } catch {
      setMsg('Erro ao ativar.')
    } finally {
      setBusy(false)
    }
  }

  const baixarCsv = async () => {
    setBusy(true)
    setMsg(null)
    try {
      let url = '/api/pedidos-camiseta?limit=5000&depth=1&sort=-createdAt'
      if (csvLoteId) url += `&where[lote][equals]=${csvLoteId}`
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
      const csv = '﻿' + [header.join(','), ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const dl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const slug = csvLoteId
        ? (lotes.find((l) => String(l.id) === csvLoteId)?.nome || 'lote').replace(/[^\w-]+/g, '-').toLowerCase()
        : 'todos'
      a.href = dl
      a.download = `pedidos-${slug}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(dl)
      setMsg(`${docs.length} pedido(s) exportado(s).`)
    } catch {
      setMsg('Erro ao gerar o CSV.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '4px 0 24px' }}>
      {/* LOTES */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#053A44', marginBottom: 8 }}>
          Lote ativo: <span style={{ color: ativo ? '#053A44' : '#b91c1c' }}>{ativo ? ativo.nome : 'nenhum (pedidos fechados)'}</span>
        </div>

        {lotes.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lotes.map((l) => (
              <li key={String(l.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 13 }}>
                <span style={{ color: '#0e0e0c' }}>
                  {l.nome}
                  {l.ativo && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: '#053A44', background: 'rgba(119,205,222,0.25)', padding: '2px 8px', borderRadius: 999 }}>ATIVO</span>
                  )}
                </span>
                {!l.ativo && (
                  <button type="button" style={btnGhost} disabled={busy} onClick={() => ativarLote(l.id)}>
                    Ativar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            style={inputStyle}
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome do novo lote (ex: Lote 2 — Set/2026)"
          />
          <button type="button" style={btnPrimary} disabled={busy || !novoNome.trim()} onClick={criarLote}>
            Abrir novo lote
          </button>
        </div>
      </div>

      {/* EXPORTAR CSV */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#053A44' }}>Baixar pedidos:</span>
        <select value={csvLoteId} onChange={(e) => setCsvLoteId(e.target.value)} style={{ padding: '9px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', fontSize: 13 }}>
          <option value="">Todos os lotes</option>
          {lotes.map((l) => (
            <option key={String(l.id)} value={String(l.id)}>
              {l.nome}
              {l.ativo ? ' (ativo)' : ''}
            </option>
          ))}
        </select>
        <button type="button" style={btnPrimary} disabled={busy} onClick={baixarCsv}>
          ⬇  Baixar CSV pro fornecedor
        </button>
      </div>

      {msg && <span style={{ fontSize: 13, opacity: 0.75 }}>{msg}</span>}
    </div>
  )
}
