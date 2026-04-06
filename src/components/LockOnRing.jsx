function LockOnRing({ isLocked, delta, size = 280, children }) {
  const gap = isLocked ? 0 : Math.min((delta || 0) * 0.3, 20)

  return (
    <div style={{
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <rect
          x={gap / 2}
          y={gap / 2}
          width={size - gap}
          height={size - gap}
          rx="32"
          ry="32"
          fill="none"
          stroke={isLocked ? '#fffbe8' : '#ffffff25'}
          strokeWidth={isLocked ? '1.5' : '1'}
          style={{
            transition: 'all 0.4s ease',
            filter: isLocked ? 'drop-shadow(0 0 10px #fffbe866)' : 'none',
          }}
        />
      </svg>
      {children}
    </div>
  )
}

export default LockOnRing