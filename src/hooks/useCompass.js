import { useState, useEffect, useRef } from 'react'

export function useCompass() {
  const [heading, setHeading] = useState(null)
  const [beta, setBeta] = useState(null)
  const [gamma, setGamma] = useState(null)
  const [error, setError] = useState(null)
  const [needsPermission, setNeedsPermission] = useState(false)
  const receivedData = useRef(false)
  const smoothedHeading = useRef(null)
  const smoothedBeta = useRef(null)

  const ALPHA = 0.15

  const setupListeners = () => {
    const handleiOS = (event) => {
      if (event.webkitCompassHeading === null || event.webkitCompassHeading === undefined) return
      receivedData.current = true

      const raw = event.webkitCompassHeading

      if (smoothedHeading.current === null) {
        smoothedHeading.current = raw
      } else {
        let diff = raw - smoothedHeading.current
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        smoothedHeading.current = (smoothedHeading.current + ALPHA * diff + 360) % 360
      }

      if (smoothedBeta.current === null) {
        smoothedBeta.current = event.beta
      } else {
        smoothedBeta.current = smoothedBeta.current + ALPHA * (event.beta - smoothedBeta.current)
      }

      setHeading(Math.round(smoothedHeading.current * 10) / 10)
      setBeta(Math.round(smoothedBeta.current * 10) / 10)
      setGamma(event.gamma)
    }

    const handleAndroid = (event) => {
      if (event.alpha === null) return
      receivedData.current = true

      const raw = (360 - event.alpha + 360) % 360

      if (smoothedHeading.current === null) {
        smoothedHeading.current = raw
      } else {
        let diff = raw - smoothedHeading.current
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        smoothedHeading.current = (smoothedHeading.current + ALPHA * diff + 360) % 360
      }

      if (smoothedBeta.current === null) {
        smoothedBeta.current = event.beta
      } else {
        smoothedBeta.current = smoothedBeta.current + ALPHA * (event.beta - smoothedBeta.current)
      }

      setHeading(Math.round(smoothedHeading.current * 10) / 10)
      setBeta(Math.round(smoothedBeta.current * 10) / 10)
      setGamma(event.gamma)
    }

    const isIOS = typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'

    if (isIOS) {
      window.addEventListener('deviceorientation', handleiOS, true)
    } else {
      window.addEventListener('deviceorientationabsolute', handleAndroid, true)
    }

    setTimeout(() => {
      if (!receivedData.current) {
        setError('Compass not supported on this device')
      }
    }, 3000)

    return () => {
      window.removeEventListener('deviceorientation', handleiOS, true)
      window.removeEventListener('deviceorientationabsolute', handleAndroid, true)
    }
  }

  useEffect(() => {
    const isIOS = typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'

    if (isIOS) {
      // Check if permission already granted by firing a test
      DeviceOrientationEvent.requestPermission()
        .then(state => {
          if (state === 'granted') {
            setupListeners()
          } else {
            setNeedsPermission(true)
          }
        })
        .catch(() => {
          // requestPermission called outside gesture — need button
          setNeedsPermission(true)
        })
    } else {
      setupListeners()
    }
  }, [])

  const requestPermission = () => {
    DeviceOrientationEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          setNeedsPermission(false)
          setupListeners()
        } else {
          setError('Compass permission denied')
        }
      })
      .catch(() => setError('Compass permission denied'))
  }

  return { heading, beta, gamma, error, needsPermission, requestPermission }
}