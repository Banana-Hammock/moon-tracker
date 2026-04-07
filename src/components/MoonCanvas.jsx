import { useState, useEffect } from 'react'
import { getNASAMoonFrameURL } from '../utils/moonPhase'

const CRESCENT_URL = 'https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.0200.jpg'

function MoonCanvas({ size = '70%' }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const url = getNASAMoonFrameURL()

  useEffect(() => {
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.onerror = () => setError(true)
    img.src = url
  }, [url])

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      background: '#000',
      flexShrink: 0,
      position: 'relative',
    }}>

      <style>{`
        @keyframes moonPulse {
          0%   { transform: scale(1.0); }
          40%  { transform: scale(1.05); }
          50%  { transform: scale(1.0); }
          100% { transform: scale(1.0); }
        }
      `}</style>

      {/* Blurred crescent placeholder */}
      {!loaded && !error && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
        }}>
          <img
            src={CRESCENT_URL}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(12px)',
              transform: 'scale(1.1)',
              animation: 'moonPulse 4s ease-in-out infinite',
              transformOrigin: 'center center',
            }}
          />
        </div>
      )}

      {/* Real moon image — fades in when loaded */}
      <img
        src={url}
        alt="Current moon phase"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />

    </div>
  )
}

export default MoonCanvas