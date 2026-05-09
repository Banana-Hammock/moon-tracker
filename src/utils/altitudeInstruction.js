const CARDINAL_DIRECTIONS = [
  { name: 'North', min: 337.5, max: 360 },
  { name: 'North', min: 0, max: 22.5 },
  { name: 'Northeast', min: 22.5, max: 67.5 },
  { name: 'East', min: 67.5, max: 112.5 },
  { name: 'Southeast', min: 112.5, max: 157.5 },
  { name: 'South', min: 157.5, max: 202.5 },
  { name: 'Southwest', min: 202.5, max: 247.5 },
  { name: 'West', min: 247.5, max: 292.5 },
  { name: 'Northwest', min: 292.5, max: 337.5 },
]

const TURN_TEMPLATES = [
  (dir) => `Turn towards ${dir}`,
  (dir) => `Face ${dir}`,
  (dir) => `Look ${dir}`,
]

function getCardinalDirection(azimuthDeg) {
  const norm = ((azimuthDeg % 360) + 360) % 360
  for (const d of CARDINAL_DIRECTIONS) {
    if (d.min <= norm && norm < d.max) return d.name
    if (d.min === 337.5 && norm >= 337.5) return d.name
  }
  return 'North'
}

let cachedTemplate = null
let lastTemplateTime = 0

function getStableTemplate() {
  const now = Date.now()
  if (!cachedTemplate || now - lastTemplateTime > 7500) {
    cachedTemplate = TURN_TEMPLATES[Math.floor(Math.random() * TURN_TEMPLATES.length)]
    lastTemplateTime = now
  }
  return cachedTemplate
}

export function getAltitudeInstruction(altitudeRad) {
  const deg = altitudeRad * (180 / Math.PI)
  if (deg < 0) return 'The moon has set tonight'
  if (deg <= 10) return 'Look over the horizon quick'
  if (deg <= 40) return 'Look up ahead'
  return 'Look up'
}

export function getDirectionalInstruction(moonAzimuthDeg) {
  if (moonAzimuthDeg === null || moonAzimuthDeg === undefined) return 'Locating moon...'
  const direction = getCardinalDirection(moonAzimuthDeg)
  const template = getStableTemplate()
  return template(direction)
}