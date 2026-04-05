import { useClock } from '../hooks/useClock'

function StickyHeader({ visible }) {
  const { hours, minutes, seconds, day, date } = useClock()

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'var(--black)',
      padding: '12px 20px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      pointerEvents: visible ? 'all' : 'none',
    }}>
      <div>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--secondary)',
          letterSpacing: '0.08em',
          marginBottom: '2px'
        }}>
          {day}, {date}
        </div>
        <div style={{
          fontFamily: 'Funnel Display, sans-serif',
          fontWeight: 475,
          fontSize: '2rem',
          color: 'var(--text)',
          letterSpacing: '0.05em',
          lineHeight: 1,
        }}>
          {hours}:{minutes}:{seconds}
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