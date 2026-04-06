import { getNASAMoonFrameURL } from '../utils/moonPhase'

function MoonCanvas({ size = '70%' }) {
  const url = getNASAMoonFrameURL()

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      background: '#000',
      flexShrink: 0,
    }}>
      <img
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