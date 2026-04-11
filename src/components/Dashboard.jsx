import Compass from './Compass'
import ViewingWindow from './ViewingWindow'
import { getMoonPhaseName, getMoonAge, formatTime } from '../utils/moonPhase'
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
      justifyContent: 'flex-start',
      ...style,
    }}>
      {label && (
        <small style={{
          color: style?.color ? `${style.color}99` : 'var(--secondary)',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </small>
      )}
      {children ? children : (
        <div style={{
          fontFamily: 'Funnel Display, sans-serif',
          fontWeight: '700',
          fontSize: '1.4rem',
          color: style?.color || 'var(--text)',
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

  // Colored card styles
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
  const blackCard = {
    background: '#000000',
    border: '0.5px solid #ffffff10',
    color: 'var(--text)',
  }

  return (
    <div style={{
      padding: '0 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>

      {/* Row 1: Compass + Visibility + Cloud/Temp */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'stretch' }}>
        <div style={{
          background: '#ffffff08',
          border: '0.5px solid #ffffff15',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Compass heading={heading} moonAzimuth={moonData.azimuth} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <DashCard label="Visibility" value={visibility} style={{ flex: 1, ...primaryCard }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flex: 1 }}>
            <DashCard label="Cloud" value={weather?.cloudcover !== undefined ? `${weather.cloudcover}%` : '--'} style={lightBlueCard} />
            <DashCard label="Temp" value={weather?.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : '--'} style={lightBlueCard} />
          </div>
        </div>
      </div>

      {/* Row 2: Rise/Set + Moon Phase */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <DashCard label="Rise Time" value={formatTime(moonData.rise)} style={{ flex: 1, ...primaryCard }} />
          <DashCard label="Set Time" value={formatTime(moonData.set)} style={{ flex: 1 }} />
        </div>

        <div style={{
          background: '#000000',
          border: '0.5px solid #ffffff10',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <MoonCanvas size="90px" />
          <div style={{
            fontFamily: 'Funnel Display, sans-serif',
            fontWeight: '700',
            fontSize: '0.9rem',
            color: 'var(--accent)',
            textAlign: 'center',
          }}>
            {phaseName}
          </div>
        </div>
      </div>

      {/* Optimal Viewing Window */}
      <ViewingWindow
        hourlyCloudcover={weather?.hourlyCloudcover}
        hourlyTimes={weather?.hourlyTimes}
        moonRise={moonData.rise}
        moonSet={moonData.set}
      />

      {/* Row 3: 4 small KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
        <DashCard label="Illum." value={`${illumination}%`} />
        <DashCard label="Wind" value={weather?.windspeed !== undefined ? `${Math.round(weather.windspeed)}` : '--'} />
        <DashCard label="Humid." value={weather?.humidity !== undefined ? `${weather.humidity}%` : '--'} />
        <DashCard label="Alt." value={`${altitudeDeg}°`} />
      </div>

      {/* Row 4: Distance + Lunar Age */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <DashCard label="Distance" value={`${distance.toLocaleString()} km`} style={blackCard} />
        <DashCard label="Lunar Age" value={`${moonAge} days`} />
      </div>

    </div>
  )
}

export default Dashboard