/* Logo da marca na tela de login do admin */
export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-gb.svg" alt="Guilherme Borges Assessoria" style={{ height: 56, width: 'auto' }} />
      <span
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#77CDDE',
        }}
      >
        Painel de conteúdo
      </span>
    </div>
  )
}
