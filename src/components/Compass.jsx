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
    const r = size / 2 - 10

    ctx.clearRect(0, 0, size, size)

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = '#d2bd5a'
    ctx.lineWidth = 1.5
    ctx.stroke()

    for (let i = 0; i < 72; i++) {
      const angle = (i * 5 - (heading || 0)) * Math.PI / 180
      const isMajor = i % 9 === 0
      const inner = r - (isMajor ? 10 : 5)
      ctx.beginPath()
      ctx.moveTo(cx + Math.sin(angle) * inner, cy - Math.cos(angle) * inner)
      ctx.lineTo(cx + Math.sin(angle) * r, cy - Math.cos(angle) * r)
      ctx.strokeStyle = isMajor ? '#d2bd5a' : '#d2bd5a55'
      ctx.lineWidth = isMajor ? 1.5 : 0.5
      ctx.stroke()
    }

    const cardinals = [
      { label: 'N', deg: 0 },
      { label: 'E', deg: 90 },
      { label: 'S', deg: 180 },
      { label: 'W', deg: 270 },
    ]

    cardinals.forEach(({ label, deg }) => {
      const angle = (deg - (heading || 0)) * Math.PI / 180
      const labelR = r - 22
      const x = cx + Math.sin(angle) * labelR
      const y = cy - Math.cos(angle) * labelR
      ctx.fillStyle = label === 'N' ? '#d2492d' : '#d2bd5a'
      ctx.font = '600 12px Be Vietnam Pro, system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x, y)
    })

    // Moon dot — smaller
    if (moonAzimuth !== undefined && moonAzimuth !== null) {
      const moonDeg = moonAzimuth * (180 / Math.PI) + 180
      const moonAngle = (moonDeg - (heading || 0)) * Math.PI / 180
      const moonX = cx + Math.sin(moonAngle) * (r - 5)
      const moonY = cy - Math.cos(moonAngle) * (r - 5)
      ctx.beginPath()
      ctx.arc(moonX, moonY, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#fffbe8'
      ctx.fill()
    }

    const needleAngle = (-(heading || 0)) * Math.PI / 180
    const needleLength = r * 0.55
    const needleWidth = 6

    ctx.beginPath()
    ctx.moveTo(cx + Math.sin(needleAngle - 0.15) * needleWidth, cy - Math.cos(needleAngle - 0.15) * needleWidth)
    ctx.lineTo(cx + Math.sin(needleAngle) * needleLength, cy - Math.cos(needleAngle) * needleLength)
    ctx.lineTo(cx + Math.sin(needleAngle + 0.15) * needleWidth, cy - Math.cos(needleAngle + 0.15) * needleWidth)
    ctx.closePath()
    ctx.fillStyle = '#d2492d'
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(cx + Math.sin(needleAngle - 0.15 + Math.PI) * needleWidth, cy - Math.cos(needleAngle - 0.15 + Math.PI) * needleWidth)
    ctx.lineTo(cx + Math.sin(needleAngle + Math.PI) * needleLength, cy - Math.cos(needleAngle + Math.PI) * needleLength)
    ctx.lineTo(cx + Math.sin(needleAngle + 0.15 + Math.PI) * needleWidth, cy - Math.cos(needleAngle + 0.15 + Math.PI) * needleWidth)
    ctx.closePath()
    ctx.fillStyle = '#daf5fd'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(cx, cy, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#d2bd5a'
    ctx.fill()

    const azimuthDeg = moonAzimuth !== undefined
      ? Math.round(((moonAzimuth * 180 / Math.PI) + 180 + 360) % 360)
      : null

    if (azimuthDeg !== null) {
      ctx.fillStyle = '#d2bd5a'
      ctx.font = '500 10px Be Vietnam Pro, system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${azimuthDeg}° az`, cx, cy + r * 0.72)
    }

  }, [heading, moonAzimuth])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', aspectRatio: '1', display: 'block' }}
    />
  )
}

export default Compass