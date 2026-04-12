import { useState, useEffect } from 'react'

const CRESCENT_URL = 'https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.0200.jpg'

function LockOnRing({ isLocked, offsetX, offsetY, size = '90vw' }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  const getNASAUrl = () => {
    const now = new Date()
    const start = new Date(Date.UTC(2026, 0, 1))
    const hours = Math.floor((now - start) / (1000 * 60 * 60))
    const frame = String(Math.min(hours + 1, 8760)).padStart(4, '0')
    return `https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.${frame}.jpg`
  }

  useEffect(() => {
    const img = new Image()
    img.onload = () => setImgLoaded(true)
    img.src = getNASAUrl()
  }, [])

  // 15px inset from size on all sides
  const heightStyle = `calc(${size} * 1.2)`

  return (
    <div style={{
      position: 'relative',
      width: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Outer ring area — only visible when locked
    }}>
      <style>{`
        @keyframes ringFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes moonPulse {
          0%   { transform: scale(1.0); }
          40%  { transform: scale(1.05); }
          50%  { transform: scale(1.0); }
          100% { transform: scale(1.0); }
        }
      `}</style>

      {/* Lock-on ring — 15px wider than box on all sides */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          inset: '-15px',
          borderRadius: '47px',
          border: '1.5px solid #fffbe8',
          animation: 'ringFadeIn 0.8s ease forwards',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      {/* Main moon box */}
      <div style={{
        position: 'relative',
        width: size,
        height: heightStyle,
        borderRadius: '32px',
        overflow: 'hidden',
        background: '#000000',
        flexShrink: 0,
        zIndex: 1,
      }}>

        {/* Vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '32px',
          background: 'radial-gradient(ellipse at center, transparent 40%, #09061355 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        {/* Blurred crescent placeholder */}
        {!imgLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '32px',
            overflow: 'hidden',
            zIndex: 1,
          }}>
            <img
              src={CRESCENT_URL}
              alt=""
              style={{
                width: '110%',
                height: '110%',
                objectFit: 'cover',
                filter: 'blur(12px)',
                animation: 'moonPulse 4s ease-in-out infinite',
                transformOrigin: 'center center',
              }}
            />
          </div>
        )}

        {/* Moon floats freely */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${offsetX || 0}px), calc(-50% + ${offsetY || 0}px))`,
          transition: 'transform 0.15s ease-out',
          width: '60%',
          aspectRatio: '1',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#000',
          flexShrink: 0,
          zIndex: 2,
          opacity: imgLoaded ? 1 : 0,
        }}>
          <img
            src={getNASAUrl()}
            alt="Moon"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default LockOnRing