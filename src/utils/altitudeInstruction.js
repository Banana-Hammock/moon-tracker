export function getAltitudeInstruction(altitudeRad) {
  const deg = altitudeRad * (180/Math.PI)

  if (deg < 0) return "The Moon has set tonight"
  if (deg < 10) return "Look over the horizon quick"
  if (deg < 0) return "Look up ahead"
  return "Look Up"
}