import { useState, useEffect } from 'react'

export function useCompass() {
  const [heading, setHeading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        // iOS — already true north
        setHeading(event.webkitCompassHeading)
      } else if (event.absolute === true && event.alpha !== null) {
        // Android absolute orientation — true north
        setHeading(360 - event.alpha)
      } else if (event.alpha !== null) {
        // Fallback — request absolute orientation
        setHeading(360 - event.alpha)
      }
    }

    if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true)
          } else {
            setError("Compass permission denied")
          }
        })
    } else {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true)
      // Fallback for browsers that don't support absolute
      window.addEventListener('deviceorientation', handleOrientation, true)
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
      window.removeEventListener('deviceorientation', handleOrientation, true)
    }
  }, [])

  return { heading, error }
}