import { useState, useEffect } from 'react'
import SunCalc from 'suncalc'

export function useMoonData(location) {
  const [moonData, setMoonData] = useState(null)

  useEffect(() => {
    if (!location) return

    const update = () => {
      const now = new Date()
      const pos = SunCalc.getMoonPosition(now, location.lat, location.lon)
      const illum = SunCalc.getMoonIllumination(now)
      const times = SunCalc.getMoonTimes(now, location.lat, location.lon)
      const sunPos = SunCalc.getPosition(now, location.lat, location.lon)

      let riseTime = times.rise
      if (!riseTime) {
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayTimes = SunCalc.getMoonTimes(yesterday, location.lat, location.lon)
        riseTime = yesterdayTimes.rise || null
      }

      let setTime = times.set
      if (!setTime) {
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowTimes = SunCalc.getMoonTimes(tomorrow, location.lat, location.lon)
        setTime = tomorrowTimes.set || null
      }

      setMoonData({
        altitude: pos.altitude,
        azimuth: pos.azimuth,
        distance: pos.distance,
        fraction: illum.fraction,
        phase: illum.phase,
        angle: illum.angle,
        rise: riseTime,
        set: setTime,
        sunAltitude: sunPos.altitude * 180 / Math.PI,
      })
    }

    update()
    const interval = setInterval(update, 5000)
    return () => clearInterval(interval)
  }, [location])

  return moonData
}