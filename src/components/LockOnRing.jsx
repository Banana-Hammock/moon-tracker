import { useState, useEffect } from 'react'

const CRESCENT_URL = 'https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.0200.jpg'

function LockOnRing({ isLocked, offsetX, offsetY, size = '95vw' }) {
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

  // Inner box dimensions
  const boxWidth = `calc(${size} - 30px)`
  const boxHeight = `calc((${size} - 30px) * 1.2)`

  return (
    <div style={{
      position: 'relative',
      width: size,
      // Height accounts for box + 15px padding top and bottom
      height: `calc((${size} - 30px) * 1.2 + 30px)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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

      {/* Lock-on ring — exactly 15px outside box, 15px thick */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          borderRadius: `calc(32px + 15px)`,
          border: '15px solid #fffbe8',
          animation: 'ringFadeIn 0.8s ease forwards',
          pointerEvents: 'none',
          zIndex: 0,
          boxSizing: 'border-box',
        }} />
      )}

      {/* Main moon box */}
      <div style={{
        position: 'relative',
        width: boxWidth,
        height: boxHeight,
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
          transition: 'transform 0.15s ease-out, opacity 0.8s ease',
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