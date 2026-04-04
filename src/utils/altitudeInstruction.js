export function getAltitudeInstruction(altitudeRad) {
  const deg = altitudeRad * (180/Math.PI)

  if (deg < 0) return "the moon has set tonight"
  if (deg < 10) return "look over the horizon quick"
  if (deg < 0) return "look up ahead"
  return "look up"
}