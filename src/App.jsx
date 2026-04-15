import { useState, useEffect, useRef } from 'react'
import { useLocation } from './hooks/useLocation'
import { useMoonData } from './hooks/useMoonData'
import { useCompass } from './hooks/useCompass'
import { useWeather } from './hooks/useWeather'
import { useClock } from './hooks/useClock'
import { getAltitudeInstruction } from './utils/altitudeInstruction'
import { getNASAMoonFrameURL } from './utils/moonPhase'
import HorizonStrip from './components/HorizonStrip'
import StickyHeader from './components/StickyHeader'
import LockOnRing from './components/LockOnRing'
import KPIGrid from './components/KPIGrid'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

function App() {
  const { location, city } = useLocation()
  const moonData = useMoonData(location)
  const { heading, beta, gamma } = useCompass()
  const { weather } = useWeather(location)
  const { hours, minutes, seconds, day, date } = useClock()
  const [stickyVisible, setStickyVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const horizonRef = useRef(null)
  const topSectionRef = useRef(null)

  useEffect(() => {
    const img1 = new Image()
    img1.src = getNASAMoonFrameURL()
    const now = new Date()
    const nextHour = new Date(now.getTime() + 3600000)
    const start = new Date(Date.UTC(2026, 0, 1))
    const hrs = Math.floor((nextHour - start) / (1000 * 60 * 60))
    const frame = String(Math.min(hrs + 1, 8760)).padStart(4, '0')
    const img2 = new Image()
    img2.src = `https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.${frame}.jpg`
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (horizonRef.current) observer.observe(horizonRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const topSection = topSectionRef.current
      if (!topSection) return
      const rect = topSection.getBoundingClientRect()
      const sectionHeight = topSection.offsetHeight
      const scrolledOut = -rect.top
      const progress = Math.max(0, Math.min(1, scrolledOut / (sectionHeight * 0.5)))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const moonAzimuthDeg = moonData
    ? ((moonData.azimuth * 180 / Math.PI) + 180 + 360) % 360
    : null
  const moonAltitudeDeg = moonData
    ? moonData.altitude * 180 / Math.PI
    : null

  const phonePitch = beta !== null ? beta : 90
  const phoneYaw = heading !== null ? heading : 0

  let deltaAz = 0
  let deltaAlt = 0

  if (moonAzimuthDeg !== null && moonAltitudeDeg !== null) {
    const rawAz = moonAzimuthDeg - phoneYaw
    deltaAz = ((rawAz + 540) % 360) - 180
    const phoneAltitude = phonePitch - 90
    deltaAlt = moonAltitudeDeg - phoneAltitude
  }

  const delta = Math.abs(deltaAz)
  const isLocked = delta <= 5 && Math.abs(deltaAlt) <= 10

  const pxPerDegree = 4
  const offsetX = deltaAz * pxPerDegree
  const offsetY = -deltaAlt * pxPerDegree

  const instruction = moonData
    ? isLocked
      ? getAltitudeInstruction(moonData.altitude)
      : 'Turn to find the moon'
    : 'Locating moon...'

  const blurAmount = scrollProgress * 14
  const topOpacity = 1 - scrollProgress

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <StickyHeader visible={stickyVisible} />

      {/* Top section */}
      <div
        ref={topSectionRef}
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: topOpacity,
          transition: 'filter 0.04s linear, opacity 0.04s linear',
          willChange: 'filter, opacity',
        }}
      >
        <div ref={horizonRef} style={{ background: 'var(--black)' }}>
          <HorizonStrip heading={heading} moonAzimuth={moonData?.azimuth} />

          <div style={{ padding: '12px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--secondary)',
                letterSpacing: '0.04em',
                marginBottom: '2px',
              }}>
                {day}, {date}
              </div>
              <div style={{
                fontFamily: 'Funnel Display, sans-serif',
                fontWeight: 475,
                fontSize: '1.6rem',
                color: 'var(--text)',
                letterSpacing: '0.01em',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'baseline',
                gap: '0px',
              }}>
                <span>{hours}:{minutes}</span>
                <span style={{ color: 'var(--primary)' }}>:{seconds}</span>
              </div>
            </div>

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

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0 24px',
          gap: '8px',
        }}>
          <LockOnRing
            isLocked={isLocked}
            offsetX={offsetX}
            offsetY={offsetY}
            size="95vw"
          />

          <p style={{
            fontFamily: 'Funnel Display, sans-serif',
            fontWeight: '700',
            fontSize: '1.1rem',
            letterSpacing: '0.06em',
            color: isLocked ? 'var(--accent)' : 'var(--text)',
            opacity: isLocked ? 1 : 0.7,
            transition: 'color 0.4s ease, opacity 0.4s ease',
            textAlign: 'center',
            padding: '8px 20px 0',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            {instruction}
          </p>

          <KPIGrid moonData={moonData} weather={weather} city={city} />
        </div>
      </div>

      {/* Analytics section */}
      <div style={{
        paddingTop: '48px',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '0 20px 28px',
        }}>
          <p style={{
            fontFamily: 'Funnel Display, sans-serif',
            fontWeight: '700',
            fontSize: '0.85rem',
            color: 'var(--secondary)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}>
            Analytics
          </p>
          <div style={{
            width: '32px',
            height: '1px',
            background: 'var(--secondary)',
            margin: '8px auto 0',
            opacity: 0.4,
          }} />
        </div>

        <Dashboard
          moonData={moonData}
          weather={weather}
          heading={heading}
        />

        <Footer />
      </div>

    </div>
  )
}

export default App