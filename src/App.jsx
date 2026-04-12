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
  const [scrollBlur, setScrollBlur] = useState(0)
  const horizonRef = useRef(null)
  const topSectionRef = useRef(null)
  const dashSectionRef = useRef(null)

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

  // Blur effect based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const topSection = topSectionRef.current
      if (!topSection) return
      const rect = topSection.getBoundingClientRect()
      const sectionHeight = topSection.offsetHeight
      const scrolledOut = -rect.top
      const progress = Math.max(0, Math.min(1, scrolledOut / (sectionHeight * 0.4)))
      setScrollBlur(progress)
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
      : 'turn to find the moon'
    : 'locating moon...'

  const blurAmount = scrollBlur * 12
  const brightnessAmount = 1 - scrollBlur * 0.4

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>

      <StickyHeader visible={stickyVisible} />

      {/* Top section — blurs out on scroll */}
      <div
        ref={topSectionRef}
        style={{
          filter: `blur(${blurAmount}px) brightness(${brightnessAmount})`,
          transition: 'filter 0.05s linear',
          willChange: 'filter',
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
              }}>
                {hours}:{minutes}:{seconds}
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
            delta={delta || 0}
            offsetX={offsetX}
            offsetY={offsetY}
            size="95vw"
          />

          <p style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            letterSpacing: '0.08em',
            color: isLocked ? 'var(--accent)' : 'var(--text)',
            opacity: isLocked ? 1 : 0.7,
            transition: 'color 0.4s ease, opacity 0.4s ease',
            textAlign: 'center',
            padding: '8px 20px 0',
            marginBottom: '8px',
          }}>
            {instruction}
          </p>

          <KPIGrid moonData={moonData} weather={weather} city={city} />
        </div>
      </div>

      {/* Moon Analytics section — fades in as top blurs out */}
      <div
        ref={dashSectionRef}
        style={{
          opacity: 0.3 + scrollBlur * 0.7,
          transform: `translateY(${(1 - scrollBlur) * 20}px)`,
          transition: 'opacity 0.05s linear, transform 0.05s linear',
          paddingTop: '32px',
        }}
      >
        {/* Moon Analytics header */}
        <div style={{
          textAlign: 'center',
          padding: '0 20px 24px',
        }}>
          <h4 style={{
            fontFamily: 'Funnel Display, sans-serif',
            fontWeight: '700',
            fontSize: '1.1rem',
            color: 'var(--text)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Moon Analytics
          </h4>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'var(--secondary)',
            margin: '8px auto 0',
            opacity: 0.5,
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