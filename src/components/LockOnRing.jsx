function LockOnRing({ isLocked, offsetX, offsetY, delta, size = '85vw' }) {
  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '32px',
      overflow: 'hidden',
      background: '#000000',
      flexShrink: 0,
    }}>
      {/* Moon floats freely, goes out of frame when not pointing at it */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${offsetX || 0}px), calc(-50% + ${offsetY || 0}px))`,
        transition: 'transform 0.15s ease-out',
        width: '65%',
        height: '65%',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#000',
        flexShrink: 0,
      }}>
        <img
          src={(() => {
            const now = new Date()
            const start = new Date(Date.UTC(2026, 0, 1))
            const hours = Math.floor((now - start) / (1000 * 60 * 60))
            const frame = String(Math.min(hours + 1, 8760)).padStart(4, '0')
            return `https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.${frame}.jpg`
          })()}
          alt="Moon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Lock-on ring border overlay */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <rect
          x="2"
          y="2"
          width="296"
          height="296"
          rx="32"
          ry="32"
          fill="none"
          stroke={isLocked ? '#fffbe8' : '#ffffff25'}
          strokeWidth={isLocked ? '2' : '1'}
          style={{
            transition: 'all 0.4s ease',
            filter: isLocked ? 'drop-shadow(0 0 10px #fffbe866)' : 'none',
          }}
        />
      </svg>
    </div>
  )
}

export default LockOnRing