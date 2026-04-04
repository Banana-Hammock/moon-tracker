import { useState, useEffect } from 'react'
import axios from 'axios'

export function useWeather(location) {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!location) return

    const fetch = async () => {
      try {
        const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: location.lat,
            longitude: location.lon,
            current: 'temperature_2m,cloudcover,weathercode',
            hourly: 'cloudcover',
            timezone: 'auto',
            forecast_days: 1,
          }
        })

        setWeather({
          temperature: res.data.current.temperature_2m,
          cloudcover: res.data.current.cloudcover,
          hourlyCloudcover: res.data.hourly.cloudcover,
          hourlyTimes: res.data.hourly.time,
        })
      } catch (err) {
        setError("Couldn't fetch weather data")
      }
    }

    fetch()
  }, [location])

  return { weather, error }
}