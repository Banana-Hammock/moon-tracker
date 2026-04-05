import { useState, useEffect, useRef } from 'react'

export function useCompass() {
  const [heading, setHeading] = useState(null)
  const [error, setError] = useState(null)
  const receivedData = useRef(false)

  useEffect(() => {
    const handleAbsolute = (event) => {
      if (event.alpha === null) return
      receivedData.current = true
      const h = (360 - event.alpha + 360) % 360
      setHeading(h)
    }

    const setup = () => {
      window.addEventListener('deviceorientationabsolute', handleAbsolute, true)

      setTimeout(() => {
        if (!receivedData.current) {
          setError("Compass not supported on this device")
        }
      }, 3000)
    }

    if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            setup()
          } else {
            setError("Compass permission denied")
          }
        })
    } else {
      setup()
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleAbsolute, true)
    }
  }, [])

  return { heading, error }
}