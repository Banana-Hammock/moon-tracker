import {useState, useEffect} from 'react'

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("It seems that geolocation isn't supported on this device")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (err) => {
        setError(err.message)
      }
    )
  }, [])

  return {location, error}
}