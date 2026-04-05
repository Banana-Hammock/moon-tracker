import { useEffect, useRef } from 'react'
import { getNASAMoonFrameURL } from '../utils/moonPhase'

function MoonCanvas({ size = 220 }) {
  const imgRef = useRef(null)
  const url = getNASAMoonFrameURL()

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      overflow: 'hidden',
      background: '#000',
    }}>
      <img
        ref={imgRef}
        src={url}
        alt="Current moon phase"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  )
}

export default MoonCanvas