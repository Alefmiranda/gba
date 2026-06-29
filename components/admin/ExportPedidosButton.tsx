'use client'

// Painel de controle no topo da lista de Pedidos: gerencia lotes (ativo / abrir
// novo / ativar / apagar) e baixa a lista em PDF por lote. Tudo num lugar só.
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
const btnDanger: React.CSSProperties = {
  background: 'transparent',
  color: '#b91c1c',
  border: '1px solid rgba(185,28,28,0.3)',
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

  // quantos pedidos estão neste lote (pra avisar antes de apagar) — null = não deu pra contar
  const contarPedidos = async (id: string | number): Promise<number | null> => {
    try {
      const r = await fetch(`/api/pedidos-camiseta?where[lote][equals]=${id}&limit=1&depth=0`, { credentials: 'include' })
      if (!r.ok) return null
      const d = await r.json()
      return typeof d.totalDocs === 'number' ? d.totalDocs : null
    } catch {
      return null
    }
  }

  const apagarLote = async (l: Lote) => {
    setBusy(true) // trava os botões já durante a contagem (evita double-click / confirm duplicado)
    setMsg(null)
    const count = await contarPedidos(l.id)
    let aviso: string
    if (count === null) {
      // não deu pra confirmar a contagem: avisa pelo pior caso, nunca como "vazio"
      aviso = `Não consegui confirmar quantos pedidos o lote "${l.nome}" tem. Se ele tiver pedidos, eles perdem o vínculo com o lote (mas continuam salvos no admin).${l.ativo ? ' Ele também é o lote ativo.' : ''}\n\nApagar mesmo? Essa ação não tem volta.`
    } else if (count > 0) {
      aviso = `O lote "${l.nome}" tem ${count} pedido(s). Se apagar, esses pedidos perdem o vínculo com o lote (mas continuam salvos no admin).${l.ativo ? ' Ele também é o lote ativo.' : ''}\n\nApagar mesmo? Essa ação não tem volta.`
    } else if (l.ativo) {
      aviso = `"${l.nome}" é o lote ATIVO e está vazio. Se apagar, os pedidos novos ficam sem lote até você ativar outro.\n\nApagar mesmo?`
    } else {
      aviso = `Apagar o lote "${l.nome}"? Ele está vazio. Essa ação não tem volta.`
    }
    if (!window.confirm(aviso)) {
      setBusy(false)
      return
    }
    try {
      const r = await fetch(`/api/lotes/${l.id}`, { method: 'DELETE', credentials: 'include' })
      if (!r.ok) throw new Error()
      await carregarLotes()
      setMsg(`🗑️ Lote "${l.nome}" apagado.`)
    } catch {
      setMsg('Erro ao apagar o lote.')
    } finally {
      setBusy(false)
    }
  }

  const baixarPdf = async () => {
    setBusy(true)
    setMsg(null)
    try {
      let url = '/api/pedidos-camiseta?limit=5000&depth=0&sort=-createdAt'
      if (csvLoteId) url += `&where[lote][equals]=${csvLoteId}`
      const r = await fetch(url, { credentials: 'include' })
      if (!r.ok) throw new Error('fetch')
      const data = await r.json()
      const docs: Pedido[] = data.docs || []
      if (!docs.length) {
        setMsg('Nenhum pedido neste lote ainda.')
        return
      }

      const loteNome = csvLoteId
        ? lotes.find((l) => String(l.id) === csvLoteId)?.nome || 'Lote'
        : 'Todos os lotes'

      // carrega o gerador de PDF só na hora (fora do bundle inicial do admin)
      const { jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const marginX = 40
      const brand: [number, number, number] = [5, 58, 68]

      // cabeçalho
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(...brand)
      doc.text('Guilherme Borges Assessoria', marginX, 46)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(70, 70, 70)
      doc.text('Pedidos de camiseta', marginX, 64)
      doc.setFontSize(10)
      doc.setTextColor(90, 90, 90)
      doc.text(`Lote: ${loteNome}`, marginX, 82)
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, marginX, 96)
      const totalPecas = docs.reduce((s, d) => s + (Number(d.quantidade) || 0), 0)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...brand)
      doc.text(`Total: ${docs.length} pedido(s)  ·  ${totalPecas} peça(s)`, marginX, 112)

      // resumo de produção (agrupado por estampa + corte + tamanho) — o que o fornecedor produz
      const grupos = new Map<string, { camiseta: string; modelo: string; tamanho: string; qtd: number }>()
      for (const d of docs) {
        const key = `${d.camiseta ?? ''}||${d.modelo ?? ''}||${d.tamanho ?? ''}`
        const g = grupos.get(key) || { camiseta: d.camiseta || '', modelo: d.modelo || '', tamanho: d.tamanho || '', qtd: 0 }
        g.qtd += Number(d.quantidade) || 0
        grupos.set(key, g)
      }
      const resumo = [...grupos.values()].sort(
        (a, b) =>
          a.camiseta.localeCompare(b.camiseta) ||
          a.modelo.localeCompare(b.modelo) ||
          a.tamanho.localeCompare(b.tamanho),
      )

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...brand)
      doc.text('Resumo de produção', marginX, 138)

      autoTable(doc, {
        startY: 146,
        margin: { left: marginX, right: marginX },
        head: [['Camiseta', 'Modelo (corte)', 'Tamanho', 'Qtd']],
        body: resumo.map((g) => [g.camiseta, g.modelo, g.tamanho, String(g.qtd)]),
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: brand, textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 242, 236] },
        columnStyles: { 3: { halign: 'center', cellWidth: 50 } },
      })

      // lista detalhada (por pessoa) — se o resumo terminar perto do rodapé, joga o título
      // e a tabela pra próxima página juntos (senão o título fica órfão e a tabela pagina sozinha)
      const afterResumo = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
      const pageH = doc.internal.pageSize.getHeight()
      let tituloY = afterResumo + 26
      if (tituloY + 64 > pageH - 40) {
        doc.addPage()
        tituloY = 56
      }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...brand)
      doc.text('Pedidos (por pessoa)', marginX, tituloY)

      autoTable(doc, {
        startY: tituloY + 8,
        margin: { left: marginX, right: marginX },
        head: [['Nome', 'WhatsApp', 'Camiseta', 'Corte', 'Tam', 'Qtd', 'Obs.']],
        body: docs.map((d) => [
          d.nome || '',
          d.whatsapp || '',
          d.camiseta || '',
          d.modelo || '',
          d.tamanho || '',
          String(d.quantidade ?? ''),
          d.observacao || '',
        ]),
        styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
        headStyles: { fillColor: brand, textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 242, 236] },
        columnStyles: {
          4: { halign: 'center', cellWidth: 34 },
          5: { halign: 'center', cellWidth: 30 },
        },
      })

      const slug = (loteNome || 'lote').replace(/[^\w-]+/g, '-').toLowerCase()
      doc.save(`pedidos-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`)
      setMsg(`${docs.length} pedido(s) exportado(s) em PDF.`)
    } catch {
      setMsg('Erro ao gerar o PDF.')
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
                <span style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!l.ativo && (
                    <button type="button" style={btnGhost} disabled={busy} onClick={() => ativarLote(l.id)}>
                      Ativar
                    </button>
                  )}
                  <button type="button" style={btnDanger} disabled={busy} onClick={() => apagarLote(l)}>
                    Apagar
                  </button>
                </span>
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

      {/* EXPORTAR PDF */}
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
        <button type="button" style={btnPrimary} disabled={busy} onClick={baixarPdf}>
          ⬇  Baixar PDF pro fornecedor
        </button>
      </div>

      {msg && <span style={{ fontSize: 13, opacity: 0.75 }}>{msg}</span>}
    </div>
  )
}
