import Compass from './Compass'
import ViewingWindow from './ViewingWindow'
import { getMoonPhaseName, getMoonAge, formatTime, formatMoonSetCountdown } from '../utils/moonPhase'
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
  const illumination = Math.round(moonData.fraction * 100)
  const distance = Math.round(moonData.distance)
  const moonSetCountdown = moonData?.set
    ? formatMoonSetCountdown(new Date(moonData.set))
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
      padding: '0 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
      }}>

        {/* Compass — left half, spans 2 rows */}
        <DashCard label="Live Compass" tall>
          <Compass heading={heading} moonAzimuth={moonData.azimuth} />
        </DashCard>

        {/* Visibility */}
        <DashCard label="Visibility" value={visibility} />

        {/* Cloud cover */}
        <DashCard label="Cloud Cover" value={weather?.cloudcover !== undefined ? `${weather.cloudcover}%` : '--'} />

        {/* Temperature + Moon Phase side by side */}
        <DashCard label="Temperature" value={weather?.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : '--'} />

        {/* Moon phase card with image - tall */}
        <DashCard label="Moon Phase" tall>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
            <MoonCanvas size={90} />
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

        {/* Moon sets countdown */}
        <DashCard label="Moon Sets In" value={moonSetCountdown} wide />

      </div>
    </div>
  )
}

export default Dashboard