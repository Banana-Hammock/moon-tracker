import { useState, useEffect } from 'react'
import axios from 'axios'

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [city, setCity] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported on this device')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setLocation({ lat, lon })

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const addr = res.data.address
          setCity(addr.city || addr.town || addr.village || addr.county || 'Unknown')
        } catch {
          setCity(null)
        }
      },
      (err) => setError(err.message),
      {
        maximumAge: 300000,
        timeout: 10000,
        enableHighAccuracy: false,
      }
    )
  }, [])

  return { location, city, error }
}