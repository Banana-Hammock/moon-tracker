import { useState, useEffect, useRef } from 'react'
import { useLocation } from './hooks/useLocation'
import { useMoonData } from './hooks/useMoonData'
import { useCompass } from './hooks/useCompass'
import { useWeather } from './hooks/useWeather'
import { useClock } from './hooks/useClock'
import { getAltitudeInstruction } from './utils/altitudeInstruction'

import HorizonStrip from './components/HorizonStrip'
import StickyHeader from './components/StickyHeader'
import LockOnRing from './components/LockOnRing'
import KPIGrid from './components/KPIGrid'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

function App() {
  const { location } = useLocation()
  const moonData = useMoonData(location)
  const { heading } = useCompass()
  const { weather } = useWeather(location)
  const { hours, minutes, seconds, day, date } = useClock()
  const [stickyVisible, setStickyVisible] = useState(false)
  const horizonRef = useRef(null)

  // Show sticky header when horizon strip scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (horizonRef.current) observer.observe(horizonRef.current)
    return () => observer.disconnect()
  }, [])

  // Calculate delta between heading and moon azimuth
  const moonAzimuthDeg = moonData
    ? ((moonData.azimuth * 180 / Math.PI) + 180 + 360) % 360
    : null

  let delta = null
  if (heading !== null && moonAzimuthDeg !== null) {
    delta = Math.abs(((moonAzimuthDeg - heading) + 540) % 360 - 180)
  }

  const isLocked = delta !== null && delta <= 5
  const instruction = moonData
    ? isLocked
      ? getAltitudeInstruction(moonData.altitude)
      : 'turn to find the moon'
    : 'locating moon...'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>

      {/* Sticky header — fades in when horizon strip leaves view */}
      <StickyHeader visible={stickyVisible} />

      {/* Horizon strip */}
      <div ref={horizonRef} style={{ background: 'var(--black)' }}>
        <HorizonStrip heading={heading} moonAzimuth={moonData?.azimuth} />

        {/* Date and time below horizon strip */}
        <div style={{ padding: '12px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--secondary)',
              letterSpacing: '0.08em',
              marginBottom: '2px',
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

          {/* Hamburger */}
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
      </div>

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0 16px',
        gap: '16px',
      }}>

        {/* Lock on ring with floating moon */}
        {(() => {
          const maxOffset = 150

          const offsetX = heading !== null && moonAzimuthDeg !== null
            ? (() => {
                const raw = moonAzimuthDeg - heading
                const diff = ((raw + 540) % 360) - 180
                return Math.max(-maxOffset, Math.min(maxOffset, diff * 3))
              })()
            : 0

          const offsetY = moonData
            ? (() => {
                const altDeg = moonData.altitude * 180 / Math.PI
                const offset = -(altDeg - 30) * 3
                return Math.max(-maxOffset, Math.min(maxOffset, offset))
              })()
            : 0

          return (
            <LockOnRing
              isLocked={isLocked}
              delta={delta || 0}
              offsetX={offsetX}
              offsetY={offsetY}
              size="85vw"
            />
          )
        })()}

        {/* Instruction */}
        <p style={{
          fontSize: '1.1rem',
          fontWeight: '300',
          letterSpacing: '0.08em',
          color: isLocked ? 'var(--accent)' : 'var(--text)',
          opacity: isLocked ? 1 : 0.7,
          transition: 'color 0.4s ease, opacity 0.4s ease',
          textAlign: 'center',
          padding: '0 20px',
        }}>
          {instruction}
        </p>

        {/* KPI grid */}
        <KPIGrid moonData={moonData} weather={weather} />

      </div>

      {/* Dashboard */}
      <Dashboard
        moonData={moonData}
        weather={weather}
        heading={heading}
      />

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default App