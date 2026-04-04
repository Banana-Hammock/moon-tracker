import {useState, useEffect} from 'react'
import SunCalc from 'suncalc'

export function useMoonData(location) {
  const [moonData, setMoonData] = useState(null)

  useEffect(() => {
    if (!location) return

    const update = () => {
      const now = new Date()
      const pos = SunCalc. getMoonPosition(now, location.lat, location.lon)
      const illum = SunCalc.getMoonIllumination(now)
      const times = SunCalc. getMoonTimes(now, location.lat, location.lon)
    
      setMoonData({
        altitude: pos.altitude,
        azimuth: pos.azimuth,
        distance: pos.distance,
        fraction: illum.fraction,
        phase: illum.phase,
        angle: illum.angle,
        rise: times.rise,
        set: times.set,
      })
    }

    update()
    const interval = setInterval(update, 5000)
    return () => clearInterval(interval)
  }, [location])

  return moonData
}