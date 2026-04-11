import { useEffect, useRef } from 'react'

function HorizonStrip({ heading, moonAzimuth }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    const centerY = height / 2

    // Ruler tick marks every 5 degrees
    for (let deg = 0; deg < 360; deg += 5) {
      let diff = deg - (heading || 0)
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      const x = width / 2 + (diff / 90) * (width / 2)
      if (x < 0 || x > width) continue

      const isMajor = deg % 45 === 0
      const tickHeight = isMajor ? 8 : 4
      ctx.beginPath()
      ctx.moveTo(x, centerY + 2)
      ctx.lineTo(x, centerY + 2 + tickHeight)
      ctx.strokeStyle = isMajor ? '#d2bd5a88' : '#d2bd5a33'
      ctx.lineWidth = isMajor ? 1 : 0.5
      ctx.stroke()
    }

    // Cardinal direction labels
    const directions = [
      { label: 'N', deg: 0 },
      { label: 'NE', deg: 45 },
      { label: 'E', deg: 90 },
      { label: 'SE', deg: 135 },
      { label: 'S', deg: 180 },
      { label: 'SW', deg: 225 },
      { label: 'W', deg: 270 },
      { label: 'NW', deg: 315 },
    ]

    directions.forEach(({ label, deg }) => {
      let diff = deg - (heading || 0)
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      const x = width / 2 + (diff / 90) * (width / 2)
      if (x < 0 || x > width) return

      ctx.fillStyle = '#d2bd5a'
      ctx.font = '500 11px Be Vietnam Pro, system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(label, x, centerY - 4)
    })

    // Moon dot — smaller radius
    if (moonAzimuth !== undefined && moonAzimuth !== null) {
      const moonDeg = moonAzimuth * (180 / Math.PI) + 180
      let moonDiff = moonDeg - (heading || 0)
      if (moonDiff > 180) moonDiff -= 360
      if (moonDiff < -180) moonDiff += 360
      const moonX = width / 2 + (moonDiff / 90) * (width / 2)
      if (moonX >= 0 && moonX <= width) {
        ctx.beginPath()
        ctx.arc(moonX, centerY, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#fffbe8'
        ctx.fill()
      }
    }

  }, [heading, moonAzimuth])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '44px' }}
    />
  )
}

export default HorizonStrip