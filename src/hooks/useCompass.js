import { useState, useEffect, useRef } from 'react'

export function useCompass() {
  const [heading, setHeading] = useState(null)
  const [beta, setBeta] = useState(null)
  const [gamma, setGamma] = useState(null)
  const [error, setError] = useState(null)
  const receivedData = useRef(false)
  const smoothedHeading = useRef(null)
  const smoothedBeta = useRef(null)

  useEffect(() => {
    const ALPHA = 0.15 // lower = smoother but more lag, higher = more responsive

    const handleAbsolute = (event) => {
      if (event.alpha === null) return
      receivedData.current = true

      const raw = (360 - event.alpha + 360) % 360

      // Low-pass filter for heading — handle 0/360 wraparound
      if (smoothedHeading.current === null) {
        smoothedHeading.current = raw
      } else {
        let diff = raw - smoothedHeading.current
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        smoothedHeading.current = smoothedHeading.current + ALPHA * diff
        smoothedHeading.current = (smoothedHeading.current + 360) % 360
      }

      // Low-pass filter for beta
      if (smoothedBeta.current === null) {
        smoothedBeta.current = event.beta
      } else {
        smoothedBeta.current = smoothedBeta.current + ALPHA * (event.beta - smoothedBeta.current)
      }

      setHeading(Math.round(smoothedHeading.current * 10) / 10)
      setBeta(Math.round(smoothedBeta.current * 10) / 10)
      setGamma(event.gamma)
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

  return { heading, beta, gamma, error }
}