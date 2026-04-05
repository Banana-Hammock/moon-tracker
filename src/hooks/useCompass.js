import { useState, useEffect } from 'react'

export function useCompass() {
  const [heading, setHeading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleAbsolute = (event) => {
      if (event.alpha === null) return
      const h = (360 - event.alpha + 360) % 360
      setHeading(h)
    }

    const setup = () => {
      window.addEventListener('deviceorientationabsolute', handleAbsolute, true)
      
      // Check after 3 seconds if we got any data
      setTimeout(() => {
        if (heading === null) {
          setError("Compass not supported on this device")
        }
      }, 3000)
    }

    if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            setup()
          } else {
            setError("Compass permission denied")
          }
        })
    } else {
      // Android
      setup()
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleAbsolute, true)
    }
  }, [])

  return { heading, error }
}