import { useLocation } from './hooks/useLocation'
import { useMoonData } from './hooks/useMoonData'
import { useCompass } from './hooks/useCompass'
import { useWeather } from './hooks/useWeather'
import HorizonStrip from './components/HorizonStrip'

function App() {
  const { location, error: locationError } = useLocation()
  const moonData = useMoonData(location)
  const { heading, error: compassError } = useCompass()
  const { weather, error: weatherError } = useWeather(location)

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1>Look Up v1</h1>
      
      <h3>Location</h3>
      <pre>{locationError ? locationError : JSON.stringify(location, null, 2)}</pre>

      <h3>Moon Data</h3>
      <pre>{JSON.stringify(moonData, null, 2)}</pre>

      <h3>Compass Heading</h3>
      <pre>{compassError ? compassError : heading ? `${heading.toFixed(1)}°` : 'waiting...'}</pre>

      <HorizonStrip heading={heading} moonAzimuth={moonData?.azimuth} />

      <h3>Weather</h3>
      <pre>{weatherError ? weatherError : JSON.stringify(weather, null, 2)}</pre>
    </div>
  )
}

export default App