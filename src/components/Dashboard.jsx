import Compass from './Compass'
import ViewingWindow from './ViewingWindow'
import { getMoonPhaseName, getMoonAge, formatTime } from '../utils/moonPhase'
import MoonCanvas from './MoonCanvas'

function DashCard({ label, value, children, style, labelSize }) {
  const textColor = style?.color || 'var(--text)'
  const labelColor = style?.labelColor || 'var(--secondary)'

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
          color: labelColor,
          fontSize: labelSize || '0.7rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight: 1.2,
        }}>
          {label}
        </small>
      )}
      {children ? children : (
        <div style={{
          fontFamily: 'Funnel Display, sans-serif',
          fontWeight: '700',
          fontSize: '1.4rem',
          color: textColor,
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

  const primaryCard = {
    background: 'var(--primary)',
    border: 'none',
    color: 'var(--text)',
    labelColor: '#daf5fd88',
  }

  const lightBlueCard = {
    background: '#daf5fd',
    border: 'none',
    color: 'var(--background)',
    labelColor: '#09061388',
  }

  const blackCard = {
    background: '#000000',
    border: '0.5px solid #ffffff10',
    color: 'var(--text)',
    labelColor: '#daf5fd88',
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
          padding: '12px',
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

      {/* Row 2: Rise/Set + Moon Phase — equal heights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

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
          minHeight: '160px',
        }}>
          <MoonCanvas size="70px" />
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

      {/* Optimal Viewing Window — true black bg */}
      <div style={{
        background: '#000000',
        border: '0.5px solid #ffffff10',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <ViewingWindow
          hourlyCloudcover={weather?.hourlyCloudcover}
          hourlyTimes={weather?.hourlyTimes}
          moonRise={moonData.rise}
          moonSet={moonData.set}
        />
      </div>

      {/* Row 3: Illumination, Altitude, Wind Speed, Humidity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
        <DashCard
          label="Illum."
          value={`${illumination}%`}
          style={lightBlueCard}
          labelSize="0.58rem"
        />
        <DashCard
          label="Alt."
          value={`${altitudeDeg}°`}
          style={primaryCard}
          labelSize="0.58rem"
        />
        <DashCard
          label="Wind km/h"
          value={weather?.windspeed !== undefined ? `${Math.round(weather.windspeed)}` : '--'}
          labelSize="0.58rem"
        />
        <DashCard
          label="Humid."
          value={weather?.humidity !== undefined ? `${weather.humidity}%` : '--'}
          labelSize="0.58rem"
        />
      </div>

      {/* Row 4: Distance + Lunar Age */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <DashCard label="Distance" value={`${distance.toLocaleString()} km`} style={blackCard} />
        <DashCard label="Lunar Age" value={`${moonAge} days`} style={lightBlueCard} />
      </div>

    </div>
  )
}

export default Dashboard