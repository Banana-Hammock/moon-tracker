import { formatMoonSetCountdown } from '../utils/moonPhase'
import { getMLVisibilityScore, getVisibilityLabel } from '../utils/visibilityModel'

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

  const altitudeDeg = moonData
    ? `${Math.round(moonData.altitude * 180 / Math.PI)}°`
    : '--'

  // ML visibility score
  let visibilityLabel = '--'
  if (moonData && weather) {
    const score = getMLVisibilityScore({
      cloud_cover: weather.cloudcover ?? 50,
      humidity: weather.humidity ?? 50,
      wind_speed: weather.windspeed ?? 0,
      weather_code: weather.weathercode ?? 0,
      sun_alt: moonData.sunAltitude ?? 0,
      moon_alt: moonData.altitude * 180 / Math.PI,
      moon_illum: moonData.fraction,
    })
    visibilityLabel = getVisibilityLabel(score)
  }

  const primaryCard = {
    background: 'var(--primary)',
    border: 'none',
    color: 'var(--text)',
    labelColor: 'var(--text)',
  }

  const lightBlueCard = {
    background: '#daf5fd',
    border: 'none',
    color: 'var(--background)',
    labelColor: 'var(--background)',
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
        value={visibilityLabel}
        style={primaryCard}
        valueFontSize="1.6rem"
      />
      <KPICard label="Altitude" value={altitudeDeg} style={lightBlueCard} />
    </div>
  )
}

export default KPIGrid