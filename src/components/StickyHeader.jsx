import { useClock } from '../hooks/useClock'

function StickyHeader({ visible }) {
  const { hours, minutes, seconds, day, date } = useClock()

  return (
    <div style={{
      position: 'fixed',
      top: '8px',
      left: '8px',
      right: '8px',
      zIndex: 100,
      background: 'var(--black)',
      borderRadius: '28px',
      padding: '10px 20px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-120%)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      pointerEvents: visible ? 'all' : 'none',
    }}>
      <div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--secondary)',
          letterSpacing: '0.04em',
          marginBottom: '1px',
        }}>
          {day}, {date}
        </div>
        <div style={{
          fontFamily: 'Funnel Display, sans-serif',
          fontWeight: 475,
          fontSize: '1.6rem',
          color: 'var(--text)',
          letterSpacing: '0.01em',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'baseline',
        }}>
          <span>{hours}:{minutes}</span>
          <span style={{ color: 'var(--primary)' }}>:{seconds}</span>
        </div>
      </div>

      <button style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '4px',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '22px',
            height: '2px',
            background: 'var(--text)',
            borderRadius: '2px',
          }} />
        ))}
      </button>
    </div>
  )
}

export default StickyHeader