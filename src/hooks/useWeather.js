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
            current: 'temperature_2m,cloudcover,weathercode,windspeed_10m,relativehumidity_2m',
            hourly: 'cloudcover',
            timezone: 'auto',
            forecast_days: 1,
          }
        })

        setWeather({
          temperature: res.data.current.temperature_2m,
          cloudcover: res.data.current.cloudcover,
          windspeed: res.data.current.windspeed_10m,
          humidity: res.data.current.relativehumidity_2m,
          hourlyCloudcover: res.data.hourly.cloudcover,
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