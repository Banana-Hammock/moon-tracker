import { formatMoonSetCountdown } from '../utils/moonPhase'

function KPICard({ label, value, style, valueFontSize }) {
  const textColor = style?.color || 'var(--text)'
  const labelColor = style?.labelColor || 'var(--text)'

  return (
    <div style={{
      background: '#ffffff08',
      border: 'none',
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
        color: labelColor,
      }}>
        {label}
      </small>
      <div style={{
        fontFamily: 'Funnel Display, sans-serif',
        fontWeight: '700',
        fontSize: valueFontSize || '1.4rem',
        color: textColor,
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

  const cloudcover = weather?.cloudcover !== undefined ? `${weather.cloudcover}%` : '--'

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
    color: 'var(--text)',
    labelColor: '#daf5fd99',
  }

  const lightBlueCard = {
    background: '#daf5fd',
    border: 'none',
    color: 'var(--background)',
    labelColor: '#09061399',
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
      <KPICard
        label="Visibility"
        value={visibility}
        style={primaryCard}
        valueFontSize="1.6rem"
      />
      <KPICard label="Cloud Cover" value={cloudcover} style={lightBlueCard} />
    </div>
  )
}

export default KPIGrid