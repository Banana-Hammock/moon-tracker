import { useState, useEffect } from 'react'
import axios from 'axios'

export function useWeather(location) {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!location) return

    const fetchWeather = async () => {
      try {
        const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: location.lat,
            longitude: location.lon,
            current: 'temperature_2m,cloud_cover,weather_code,wind_speed_10m,relative_humidity_2m',
            hourly: 'cloud_cover',
            timezone: 'auto',
            forecast_days: 1,
          }
        })

        setWeather({
          temperature: res.data.current.temperature_2m,
          cloudcover: res.data.current.cloud_cover,
          windspeed: res.data.current.wind_speed_10m,
          humidity: res.data.current.relative_humidity_2m,
          hourlyCloudcover: res.data.hourly.cloud_cover,
          hourlyTimes: res.data.hourly.time,
        })
      } catch (err) {
        setError("Couldn't fetch weather data")
      }
    }

    fetchWeather()
  }, [location])

  return { weather, error }
}