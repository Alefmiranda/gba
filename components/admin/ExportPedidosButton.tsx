'use client'

/**
 * Botão "Baixar lista (CSV)" exibido acima da tabela de Pedidos de Camiseta
 * no admin. Aponta pra rota protegida /exportar/pedidos-camisetas, que devolve
 * o CSV pronto pro fornecedor.
 */
import React from 'react'

export default function ExportPedidosButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 0 1rem' }}>
      <a
        href="/exportar/pedidos-camisetas"
        download
        className="btn btn--style-primary btn--size-small"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
        }}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
          <path
            d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Baixar lista (CSV)
      </a>
    </div>
  )
}
