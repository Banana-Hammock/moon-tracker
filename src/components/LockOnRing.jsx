function LockOnRing({ isLocked, delta, size = 220, children }) {
  const ringSize = size + 20
  const gap = isLocked ? 0 : Math.min(delta * 0.3, 30)

  return (
    <div style={{
      position: 'relative',
      width: `${ringSize}px`,
      height: `${ringSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg
        width={ringSize}
        height={ringSize}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <rect
          x={gap / 2}
          y={gap / 2}
          width={ringSize - gap}
          height={ringSize - gap}
          rx={isLocked ? '36' : '42'}
          ry={isLocked ? '36' : '42'}
          fill="none"
          stroke={isLocked ? '#fffbe8' : '#ffffff30'}
          strokeWidth={isLocked ? '1.5' : '1'}
          style={{
            transition: 'all 0.3s ease',
            filter: isLocked ? 'drop-shadow(0 0 8px #fffbe888)' : 'none',
          }}
        />
      </svg>
      {children}
    </div>
  )
}

export default LockOnRing