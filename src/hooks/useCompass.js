import {useState, useEffect} from 'react'

export function useCompass() {
  const [heading, setHeading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.webkitCompassHeading !== undefined) {
        // iOS
        setHeading(event.webkitCompassHeading)
      } else if (event.alpha !== null) {
        // Android
        setHeading(360 - event.alpha)
      }
    }

    if (typeof DeviceOrientationEvent !== undefined && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // explicit permission for iOS
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          } else {
            setError("Compass permission not granted")
          }
        }) 
    } else {
      window.addEventListener('deviceorientation', handleOrientation)
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  return {heading, error}
}