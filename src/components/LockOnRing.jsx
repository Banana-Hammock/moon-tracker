function LockOnRing({ isLocked, delta, offsetX, offsetY, size = '85vw', children }) {
  const gap = isLocked ? 0 : Math.min((delta || 0) * 0.3, 20)

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: '32px',
    }}>
      {/* Moon moves inside the viewfinder */}
      <div style={{
        position: 'absolute',
        transform: `translate(${offsetX || 0}px, ${offsetY || 0}px)`,
        transition: 'transform 0.2s ease-out',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {children}
      </div>

      {/* Ring overlaid on top */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <rect
          x={gap / 2}
          y={gap / 2}
          width={300 - gap}
          height={300 - gap}
          rx="32"
          ry="32"
          fill="none"
          stroke={isLocked ? '#fffbe8' : '#070118'}
          strokeWidth={isLocked ? '5' : '1'}
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