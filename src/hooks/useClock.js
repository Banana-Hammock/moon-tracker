import { useState, useEffect } from 'react'

export function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const day = now.toLocaleDateString('en-IN', { weekday: 'long' })
  const date = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return { hours, minutes, seconds, day, date }
}