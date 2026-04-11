import { useEffect, useRef } from 'react'

const CRESCENT_URL = 'https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.0200.jpg'

function LockOnRing({ isLocked, offsetX, offsetY, size = '95vw' }) {

  const getNASAUrl = () => {
    const now = new Date()
    const start = new Date(Date.UTC(2026, 0, 1))
    const hours = Math.floor((now - start) / (1000 * 60 * 60))
    const frame = String(Math.min(hours + 1, 8760)).padStart(4, '0')
    return `https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.${frame}.jpg`
  }

  // 4:3 ratio — height taller
  const heightStyle = `calc(${size} * 1.2)`

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: heightStyle,
      borderRadius: '32px',
      flexShrink: 0,
      // No overflow hidden here — let glow go outward
    }}>

      <style>{`
        @keyframes glowExpand {
          0%   { opacity: 0; transform: scale(1.0); }
          30%  { opacity: 1; }
          100% { opacity: 0; transform: scale(1.06); }
        }
        @keyframes glowExpandSlow {
          0%   { opacity: 0; transform: scale(1.0); }
          20%  { opacity: 0.6; }
          100% { opacity: 0; transform: scale(1.1); }
        }
      `}</style>

      {/* Outward glow layers — sit behind the main box */}
      {isLocked && (
        <>
          <div style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '38px',
            background: 'transparent',
            border: '1px solid #fffbe855',
            animation: 'glowExpand 2.5s ease-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '35px',
            background: 'transparent',
            border: '1.5px solid #fffbe8aa',
            animation: 'glowExpandSlow 2.5s ease-out infinite 0.4s',
            pointerEvents: 'none',
            zIndex: 0,
          }} />
          {/* Grain overlay on glow */}
          <div style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '42px',
            background: 'transparent',
            boxShadow: '0 0 20px 4px #fffbe822, 0 0 40px 8px #fffbe810',
            pointerEvents: 'none',
            zIndex: 0,
          }} />
        </>
      )}

      {/* Main box — clips the moon */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '32px',
        overflow: 'hidden',
        background: '#000000',
        zIndex: 1,
      }}>

        {/* Vignette — bg bleeds into canvas edges */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '32px',
          background: `radial-gradient(ellipse at center, transparent 40%, #09061366 100%)`,
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        {/* Moon floats on a much larger virtual canvas */}
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

        {/* Thin static ring when locked */}
        {isLocked && (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '32px',
            border: '1px solid #fffbe840',
            pointerEvents: 'none',
            zIndex: 4,
          }} />
        )}
      </div>
    </div>
  )
}

export default LockOnRing