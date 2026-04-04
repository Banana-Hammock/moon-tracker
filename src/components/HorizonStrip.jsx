import { useEffect, useRef } from 'react'

function HorizonStrip({ heading, moonAzimuth }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, width, height)

    // Draw horizon line
    ctx.strokeStyle = '#ffffff30'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    // Draw compass direction labels
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
      // Difference between direction and current heading
      let diff = deg - (heading || 0)
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360

      const x = width / 2 + (diff / 90) * (width / 2)

      if (x < 0 || x > width) return

      ctx.fillStyle = '#ffffff60'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(label, x, height / 2 - 10)
    })

    // Draw moon indicator on strip
    const moonDeg = moonAzimuth * (180 / Math.PI) + 180
    let moonDiff = moonDeg - (heading || 0)
    if (moonDiff > 180) moonDiff -= 360
    if (moonDiff < -180) moonDiff += 360

    const moonX = width / 2 + (moonDiff / 90) * (width / 2)

    if (moonX >= 0 && moonX <= width) {
      ctx.beginPath()
      ctx.arc(moonX, height / 2, 10, 0, Math.PI * 2)
      ctx.fillStyle = '#ffe066'
      ctx.fill()
    }

  }, [heading, moonAzimuth])

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={80}
      style={{ display: 'block', width: '100%' }}
    />
  )
}

export default HorizonStrip