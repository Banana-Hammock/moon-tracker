export function getMoonPhaseName(phase) {
  if (phase < 0.025) return 'New Moon'
  if (phase < 0.25) return 'Waxing Crescent'
  if (phase < 0.275) return 'First Quarter'
  if (phase < 0.5) return 'Waxing Gibbous'
  if (phase < 0.525) return 'Full Moon'
  if (phase < 0.75) return 'Waning Gibbous'
  if (phase < 0.775) return 'Last Quarter'
  if (phase < 0.975) return 'Waning Crescent'
  return 'New Moon'
}

export function getMoonAge(phase) {
  return (phase * 29.53).toFixed(1)
}

export function formatMoonSetCountdown(setTime) {
  if (!setTime) return '--'
  const now = new Date()
  const diff = setTime - now
  if (diff <= 0) return 'Set'
  const totalMins = Math.floor(diff / 60000)
  if (totalMins < 1) return '< 1 min'
  if (totalMins < 5) return `< ${totalMins + 1} mins`
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function formatTime(date) {
  if (!date) return '--'
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function getNASAMoonFrameURL() {
  const now = new Date()
  const start = new Date(Date.UTC(2026, 0, 1))
  const hoursSinceStart = Math.floor((now - start) / (1000 * 60 * 60))
  const frame = Math.min(hoursSinceStart + 1, 8760)
  const padded = String(frame).padStart(4, '0')
  return `https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005587/frames/730x730_1x1_30p/moon.${padded}.jpg`
}