import Compass from './Compass'
import ViewingWindow from './ViewingWindow'
import { getMoonPhaseName, getMoonAge, formatTime, formatMoonSetCountdown } from '../utils/moonPhase'
import MoonCanvas from './MoonCanvas'

function DashCard({ label, value, children, style }) {
  return (
    <div style={{
      background: '#ffffff08',
      border: '0.5px solid #ffffff15',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      justifyContent: 'space-between',
      ...style,
    }}>
      <small style={{
        color: 'var(--secondary)',
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {label}
      </small>
      {children ? children : (
        <div style={{
          fontFamily: 'Funnel Display, sans-serif',
          fontWeight: '700',
          fontSize: '1.4rem',
          color: 'var(--text)',
          lineHeight: 1,
        }}>
          {value}
        </div>
      )}
    </div>
  )
}

function Dashboard({ moonData, weather, heading }) {
  if (!moonData) return null

  const phaseName = getMoonPhaseName(moonData.phase)
  const moonAge = getMoonAge(moonData.phase)
  const altitudeDeg = Math.round(moonData.altitude * 180 / Math.PI)
  const illumination = Math.round(moonData.fraction * 100)
  const distance = Math.round(moonData.distance)

  const visibility = weather?.cloudcover !== undefined
    ? weather.cloudcover <= 20 ? 'Excellent'
    : weather.cloudcover <= 40 ? 'Good'
    : weather.cloudcover <= 60 ? 'Fair'
    : weather.cloudcover <= 80 ? 'Poor'
    : 'Very Poor'
    : '--'

  return (
    <div style={{
      padding: '0 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>

      {/* Row 1: Compass (half) + Visibility (half, tall) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <DashCard label="Live Compass" style={{ gridRow: 'span 2' }}>
          <Compass heading={heading} moonAzimuth={moonData.azimuth} />
        </DashCard>
        <DashCard label="Visibility" value={visibility} />
        <DashCard label="Cloud Cover" value={weather?.cloudcover !== undefined ? `${weather.cloudcover}%` : '--'} />
      </div>

      {/* Row 2: Temp (half) + Moon Phase tall (half) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <DashCard label="Temperature" value={weather?.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : '--'} />
          <DashCard label="Rise Time" value={formatTime(moonData.rise)} />
          <DashCard label="Set Time" value={formatTime(moonData.set)} />
        </div>
        <DashCard label="Moon Phase">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingTop: '8px',
          }}>
            <MoonCanvas size="90px" />
            <div style={{
              fontFamily: 'Funnel Display, sans-serif',
              fontWeight: '700',
              fontSize: '0.9rem',
              color: 'var(--text)',
              textAlign: 'center',
            }}>
              {phaseName}
            </div>
          </div>
        </DashCard>
      </div>

      {/* Best viewing window - full width */}
      <ViewingWindow
        hourlyCloudcover={weather?.hourlyCloudcover}
        hourlyTimes={weather?.hourlyTimes}
        moonRise={moonData.rise}
        moonSet={moonData.set}
      />

      {/* Row 3: Illumination, Wind, Humidity, Altitude — 4 in a row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
        <DashCard label="Illum." value={`${illumination}%`} />
        <DashCard label="Wind" value={weather?.windspeed !== undefined ? `${Math.round(weather.windspeed)}` : '--'} />
        <DashCard label="Humid." value={weather?.humidity !== undefined ? `${weather.humidity}%` : '--'} />
        <DashCard label="Alt." value={`${altitudeDeg}°`} />
      </div>

      {/* Row 4: Distance + Lunar Age — half width each */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <DashCard label="Distance" value={`${distance.toLocaleString()} km`} />
        <DashCard label="Lunar Age" value={`${moonAge} days`} />
      </div>

    </div>
  )
}

export default Dashboard