import Compass from './Compass'
import ViewingWindow from './ViewingWindow'
import { getMoonPhaseName, getMoonAge, formatTime } from '../utils/moonPhase'
import MoonCanvas from './MoonCanvas'

function DashCard({ label, value, wide, tall, children }) {
  return (
    <div style={{
      background: '#ffffff08',
      border: '0.5px solid #ffffff15',
      borderRadius: '16px',
      padding: '16px',
      gridColumn: wide ? 'span 2' : 'span 1',
      gridRow: tall ? 'span 2' : 'span 1',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      justifyContent: 'space-between',
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
  const azimuthDeg = Math.round(((moonData.azimuth * 180 / Math.PI) + 180 + 360) % 360)
  const illumination = Math.round(moonData.fraction * 100)
  const distance = Math.round(moonData.distance)

  return (
    <div style={{
      background: '#ffffff05',
      border: '0.5px solid #ffffff10',
      borderRadius: '24px',
      margin: '0 16px 16px',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>

      {/* Compass */}
      <div style={{
        background: '#ffffff08',
        border: '0.5px solid #ffffff15',
        borderRadius: '16px',
        padding: '16px',
      }}>
        <small style={{
          color: 'var(--secondary)',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px',
        }}>
          Live Compass
        </small>
        <Compass heading={heading} moonAzimuth={moonData.azimuth} />
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
      }}>

        {/* Visibility */}
        <DashCard label="Visibility" value={
          weather?.cloudcover <= 20 ? 'Excellent' :
          weather?.cloudcover <= 40 ? 'Good' :
          weather?.cloudcover <= 60 ? 'Fair' :
          weather?.cloudcover <= 80 ? 'Poor' : 'Very Poor'
        } />

        {/* Cloud cover + Temp */}
        <DashCard label="Cloud Cover" value={weather?.cloudcover !== undefined ? `${weather.cloudcover}%` : '--'} />
        <DashCard label="Temperature" value={weather?.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : '--'} />

        {/* Moon phase card with image */}
        <DashCard label="Moon Phase" tall>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
            <MoonCanvas size={100} />
            <div style={{
              fontFamily: 'Funnel Display, sans-serif',
              fontWeight: '700',
              fontSize: '1rem',
              color: 'var(--text)',
              textAlign: 'center',
            }}>
              {phaseName}
            </div>
          </div>
        </DashCard>

        {/* Rise time */}
        <DashCard label="Rise Time" value={formatTime(moonData.rise)} />

        {/* Set time */}
        <DashCard label="Set Time" value={formatTime(moonData.set)} />

        {/* Best viewing window - full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <ViewingWindow
            hourlyCloudcover={weather?.hourlyCloudcover}
            hourlyTimes={weather?.hourlyTimes}
            moonRise={moonData.rise}
            moonSet={moonData.set}
          />
        </div>

        {/* Illumination */}
        <DashCard label="Illumination" value={`${illumination}%`} />

        {/* Wind speed */}
        <DashCard label="Wind Speed" value={weather?.windspeed !== undefined ? `${weather.windspeed} km/h` : '--'} />

        {/* Humidity */}
        <DashCard label="Humidity" value={weather?.humidity !== undefined ? `${weather.humidity}%` : '--'} />

        {/* Altitude */}
        <DashCard label="Altitude" value={`${altitudeDeg}°`} />

        {/* Distance */}
        <DashCard label="Distance" value={`${distance.toLocaleString()} km`} wide />

        {/* Lunar cycle age */}
        <DashCard label="Lunar Age" value={`${moonAge} days`} wide />

      </div>
    </div>
  )
}

export default Dashboard