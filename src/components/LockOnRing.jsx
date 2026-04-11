import { useEffect, useRef } from 'react'

function LockOnRing({ isLocked, offsetX, offsetY, delta, size = '95vw' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    if (!isLocked) return

    const r = 32 // corner radius
    const glowSize = 12

    // Draw outward glow only — clip outside the rounded rect
    ctx.save()

    // Create rounded rect path for clipping (inverted — draw outside)
    const roundedRect = (x, y, w, h, r) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.arcTo(x + w, y, x + w, y + r, r)
      ctx.lineTo(x + w, y + h - r)
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
      ctx.lineTo(x + r, y + h)
      ctx.arcTo(x, y + h, x, y + h - r, r)
      ctx.lineTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      ctx.closePath()
    }

    // Clip to outside of box
    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    roundedRect(0, 0, w, h, r)
    ctx.clip('evenodd')

    // Draw gradient glow outward from edges
    const gradient = ctx.createLinearGradient(0, 0, glowSize, 0)
    gradient.addColorStop(0, '#fffbe8cc')
    gradient.addColorStop(1, '#fffbe800')

    // Left edge
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, glowSize, h)

    // Right edge
    ctx.save()
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
    ctx.fillRect(0, 0, glowSize, h)
    ctx.restore()

    // Top edge
    const gradientTop = ctx.createLinearGradient(0, 0, 0, glowSize)
    gradientTop.addColorStop(0, '#fffbe8cc')
    gradientTop.addColorStop(1, '#fffbe800')
    ctx.fillStyle = gradientTop
    ctx.fillRect(0, 0, w, glowSize)

    // Bottom edge
    ctx.save()
    ctx.translate(0, h)
    ctx.scale(1, -1)
    ctx.fillStyle = gradientTop
    ctx.fillRect(0, 0, w, glowSize)
    ctx.restore()

    // Grain overlay on glow
    for (let i = 0; i < 800; i++) {
      const gx = Math.random() * w
      const gy = Math.random() * h
      const edge = Math.min(gx, gy, w - gx, h - gy)
      if (edge > glowSize * 1.5) continue
      const alpha = Math.random() * 0.15
      ctx.fillStyle = `rgba(255,251,232,${alpha})`
      ctx.fillRect(gx, gy, 1, 1)
    }

    ctx.restore()
  }, [isLocked])

  // 4:3 ratio — height taller (use width as base, height = width * 1.333)
  const heightStyle = `calc(${size} * 1.333)`

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

      {/* Subtle vignette — bg bleeds into canvas edges */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '32px',
        background: `radial-gradient(ellipse at center, transparent 55%, #09061388 100%)`,
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Moon floats freely */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${offsetX || 0}px), calc(-50% + ${offsetY || 0}px))`,
        transition: 'transform 0.15s ease-out',
        width: '62%',
        height: 'auto',
        aspectRatio: '1',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#000',
        flexShrink: 0,
        zIndex: 1,
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

      {/* Glow canvas — drawn on top, outside clip */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
          borderRadius: '32px',
        }}
      />
    </div>
  )
}

export default LockOnRing