import { useEffect, useRef } from 'react'

function Compass({ heading, moonAzimuth }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const size = canvas.offsetWidth
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 6

    ctx.clearRect(0, 0, size, size)

    // Thick true-black outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 5
    ctx.stroke()

    // Gold ring on top
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = '#d2bd5a'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Tick marks — floating inside, not touching boundary
    const tickGap = 8 // gap from outer ring
    for (let i = 0; i < 72; i++) {
      const angle = (i * 5 - (heading || 0)) * Math.PI / 180
      const isMajor = i % 9 === 0
      const tickLen = isMajor ? 10 : 5
      const outerR = r - tickGap
      const innerR = outerR - tickLen

      ctx.beginPath()
      ctx.moveTo(cx + Math.sin(angle) * outerR, cy - Math.cos(angle) * outerR)
      ctx.lineTo(cx + Math.sin(angle) * innerR, cy - Math.cos(angle) * innerR)
      ctx.strokeStyle = isMajor ? '#d2bd5a' : '#d2bd5a55'
      ctx.lineWidth = isMajor ? 1.2 : 0.5
      ctx.stroke()
    }

    // Cardinal labels
    const cardinals = [
      { label: 'N', deg: 0, color: '#3427ce' },
      { label: 'E', deg: 90, color: '#d2bd5a' },
      { label: 'S', deg: 180, color: '#d2bd5a' },
      { label: 'W', deg: 270, color: '#d2bd5a' },
    ]

    cardinals.forEach(({ label, deg, color }) => {
      const angle = (deg - (heading || 0)) * Math.PI / 180
      const labelR = r - 28
      const x = cx + Math.sin(angle) * labelR
      const y = cy - Math.cos(angle) * labelR
      ctx.fillStyle = color
      ctx.font = '600 12px Be Vietnam Pro, system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x, y)
    })

    // Moon dot — soft edges with radial gradient
    if (moonAzimuth !== undefined && moonAzimuth !== null) {
      const moonDeg = moonAzimuth * (180 / Math.PI) + 180
      const moonAngle = (moonDeg - (heading || 0)) * Math.PI / 180
      const moonX = cx + Math.sin(moonAngle) * (r - tickGap - 2)
      const moonY = cy - Math.cos(moonAngle) * (r - tickGap - 2)

      const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 4)
      moonGrad.addColorStop(0, '#fffbe8ff')
      moonGrad.addColorStop(0.6, '#fffbe8cc')
      moonGrad.addColorStop(1, '#fffbe800')
      ctx.beginPath()
      ctx.arc(moonX, moonY, 4, 0, Math.PI * 2)
      ctx.fillStyle = moonGrad
      ctx.fill()
    }

    // Needle angle
    const needleAngle = (-(heading || 0)) * Math.PI / 180
    const needleLen = r * 0.52
    const needleBase = 7

    // North needle — primary blue isosceles triangle
    ctx.beginPath()
    ctx.moveTo(
      cx + Math.sin(needleAngle) * needleLen,
      cy - Math.cos(needleAngle) * needleLen
    )
    ctx.lineTo(
      cx + Math.sin(needleAngle + Math.PI / 2) * needleBase,
      cy - Math.cos(needleAngle + Math.PI / 2) * needleBase
    )
    ctx.lineTo(
      cx + Math.sin(needleAngle - Math.PI / 2) * needleBase,
      cy - Math.cos(needleAngle - Math.PI / 2) * needleBase
    )
    ctx.closePath()
    ctx.fillStyle = '#3427ce'
    ctx.fill()

    // South needle — white isosceles triangle, same proportions
    ctx.beginPath()
    ctx.moveTo(
      cx + Math.sin(needleAngle + Math.PI) * needleLen,
      cy - Math.cos(needleAngle + Math.PI) * needleLen
    )
    ctx.lineTo(
      cx + Math.sin(needleAngle + Math.PI / 2) * needleBase,
      cy - Math.cos(needleAngle + Math.PI / 2) * needleBase
    )
    ctx.lineTo(
      cx + Math.sin(needleAngle - Math.PI / 2) * needleBase,
      cy - Math.cos(needleAngle - Math.PI / 2) * needleBase
    )
    ctx.closePath()
    ctx.fillStyle = '#daf5fd'
    ctx.fill()

  }, [heading, moonAzimuth])

  // Azimuth — fixed bottom right, doesn't rotate
  const azimuthDeg = moonAzimuth !== undefined && moonAzimuth !== null
    ? Math.round(((moonAzimuth * 180 / Math.PI) + 180 + 360) % 360)
    : null

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', aspectRatio: '1', display: 'block' }}
      />
      {azimuthDeg !== null && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#d2bd5a',
          letterSpacing: '0.05em',
        }}>
          {azimuthDeg}° az
        </div>
      )}
    </div>
  )
}

export default Compass