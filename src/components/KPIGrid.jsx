import { formatMoonSetCountdown } from '../utils/moonPhase'

function KPICard({ label, value, style }) {
  return (
    <div style={{
      background: '#ffffff08',
      border: '0.5px solid #ffffff15',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style,
    }}>
      <small style={{
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: style?.color ? `${style.color}99` : 'var(--secondary)',
        opacity: 0.8,
      }}>
        {label}
      </small>
      <div style={{
        fontFamily: 'Funnel Display, sans-serif',
        fontWeight: '700',
        fontSize: '1.4rem',
        color: style?.color || 'var(--text)',
        lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  )
}

function KPIGrid({ moonData, weather, city }) {
  const now = new Date()

  let moonTimerLabel = '--'
  let moonTimerValue = '--'

  if (moonData) {
    const riseTime = moonData.rise ? new Date(moonData.rise) : null
    const setTime = moonData.set ? new Date(moonData.set) : null
    const moonIsUp = moonData.altitude > 0

    if (moonIsUp && setTime && setTime > now) {
      moonTimerLabel = 'Moon Sets In'
      moonTimerValue = formatMoonSetCountdown(setTime)
    } else if (!moonIsUp && riseTime && riseTime > now) {
      moonTimerLabel = 'Moon Rises In'
      moonTimerValue = formatMoonSetCountdown(riseTime)
    } else {
      moonTimerLabel = moonIsUp ? 'Moon Sets In' : 'Moon Rises In'
      moonTimerValue = '--'
    }
  }

  const cloudcover = weather?.cloudcover !== undefined
    ? `${weather.cloudcover}%`
    : '--'

  const visibility = weather?.cloudcover !== undefined
    ? weather.cloudcover <= 20 ? 'Excellent'
    : weather.cloudcover <= 40 ? 'Good'
    : weather.cloudcover <= 60 ? 'Fair'
    : weather.cloudcover <= 80 ? 'Poor'
    : 'Very Poor'
    : '--'

  const primaryCard = {
    background: 'var(--primary)',
    border: 'none',
    color: 'var(--background)',
  }

  const lightBlueCard = {
    background: '#daf5fd',
    border: 'none',
    color: 'var(--background)',
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      width: '100%',
      padding: '0 20px',
    }}>
      <KPICard label={moonTimerLabel} value={moonTimerValue} />
      <KPICard label="Location" value={city || '...'} />
      <KPICard label="Visibility" value={visibility} style={primaryCard} />
      <KPICard label="Cloud Cover" value={cloudcover} style={lightBlueCard} />
    </div>
  )
}

export default KPIGrid