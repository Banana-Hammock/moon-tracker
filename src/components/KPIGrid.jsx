import { formatMoonSetCountdown, formatTime } from '../utils/moonPhase'

function KPICard({ label, value, sub }) {
  return (
    <div style={{
      background: '#ffffff08',
      border: '0.5px solid #ffffff15',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <small style={{
        color: 'var(--secondary)',
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {label}
      </small>
      <div style={{
        fontFamily: 'Funnel Display, sans-serif',
        fontWeight: '700',
        fontSize: '1.4rem',
        color: 'var(--text)',
        lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <small style={{ color: 'var(--secondary)', fontSize: '0.7rem' }}>
          {sub}
        </small>
      )}
    </div>
  )
}

function KPIGrid({ moonData, weather }) {
  const now = new Date()

  // Dynamic moon set/rise KPI
  let moonTimerLabel = '--'
  let moonTimerValue = '--'

  if (moonData) {
    const riseTime = moonData.rise ? new Date(moonData.rise) : null
    const setTime = moonData.set ? new Date(moonData.set) : null
    const moonIsUp = moonData.altitude > 0

    if (moonIsUp && setTime) {
      moonTimerLabel = 'Moon Sets In'
      moonTimerValue = formatMoonSetCountdown(setTime)
    } else if (!moonIsUp && riseTime && riseTime > now) {
      moonTimerLabel = 'Moon Rises In'
      moonTimerValue = formatMoonSetCountdown(riseTime)
    } else {
      moonTimerLabel = 'Moon Sets In'
      moonTimerValue = '--'
    }
  }

  const temp = weather?.temperature !== undefined
    ? `${Math.round(weather.temperature)}°C`
    : '--'

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

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      width: '100%',
      padding: '0 20px',
    }}>
      <KPICard label={moonTimerLabel} value={moonTimerValue} />
      <KPICard label="Temperature" value={temp} />
      <KPICard label="Visibility" value={visibility} />
      <KPICard label="Cloud Cover" value={cloudcover} />
    </div>
  )
}

export default KPIGrid