function LockOnRing({ isLocked, offsetX, offsetY, size = '95vw' }) {
  const getNASAUrl = () => {
    const now = new Date()
    const start = new Date(Date.UTC(2026, 0, 1))
    const hours = Math.floor((now - start) / (1000 * 60 * 60))
    const frame = String(Math.min(hours + 1, 8760)).padStart(4, '0')
    return `https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.${frame}.jpg`
  }

  const heightStyle = `calc(${size} * 1.2)`

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: heightStyle,
      borderRadius: '32px',
      overflow: 'hidden',
      background: '#000000',
      flexShrink: 0,
    }}>

      <style>{`
        @keyframes ringFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '32px',
        background: 'radial-gradient(ellipse at center, transparent 40%, #09061355 100%)',
        zIndex: 3,
        pointerEvents: 'none',
      }} />

      {/* Moon */}
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

      {/* Lock-on ring — solid, fades in slowly */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '32px',
          border: '1.5px solid #fffbe8',
          animation: 'ringFadeIn 0.8s ease forwards',
          pointerEvents: 'none',
          zIndex: 4,
        }} />
      )}
    </div>
  )
}

export default LockOnRing