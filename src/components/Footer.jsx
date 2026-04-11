function Footer() {
  return (
    <div style={{
      background: 'var(--primary)',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'center',
    }}>
      <div style={{
        fontFamily: 'Funnel Display, sans-serif',
        fontWeight: '700',
        fontSize: '1.2rem',
        color: 'var(--background)',
        letterSpacing: '1.15em',
      }}>
        LOOK UP
      </div>
      <small style={{
        color: 'var(--black)',
        fontSize: '0.7rem',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        Moon data powered by SunCalc · Weather by Open-Meteo · 
        Moon imagery by NASA LRO · Built with React + Vite
      </small>
      <small style={{
        color: 'var(--black)',
        fontSize: '0.65rem',
        opacity: 0.5,
      }}>
        © 2026 Look Up
      </small>
    </div>
  )
}

export default Footer