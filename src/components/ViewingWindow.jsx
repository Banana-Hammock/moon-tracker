function ViewingWindow({ hourlyCloudcover, hourlyTimes, moonRise, moonSet }) {
  if (!hourlyCloudcover || !hourlyTimes) return null

  const now = new Date()

  const slots = hourlyTimes.map((timeStr, i) => {
    const time = new Date(timeStr)
    const cover = hourlyCloudcover[i]
    const isPast = time < now
    const moonUp = moonRise && moonSet
      ? time >= new Date(moonRise) && time <= new Date(moonSet)
      : true
    return { time, cover, isPast, moonUp }
  }).filter(s => !s.isPast).slice(0, 12)

  const best = slots
    .filter(s => s.moonUp)
    .sort((a, b) => a.cover - b.cover)[0]

  const formatHour = (date) => date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase()

  return (
    <div style={{
      background: '#ffffff08',
      border: '0.5px solid #ffffff15',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <small style={{
          color: 'var(--secondary)',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Optimal Viewing Window
        </small>
        {best && (
          <small style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>
            {formatHour(best.time)} — {best.cover}% cloud
          </small>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'flex-end',
        height: '60px',
      }}>
        {slots.map((slot, i) => {
          const height = Math.max(4, (1 - slot.cover / 100) * 60)
          const isNext = best && slot.time.getTime() === best.time.getTime()
          const quality = 1 - slot.cover / 100

          // Color: best = primary blue, good = darker blue, poor = near bg
          const barColor = isNext
            ? '#3427ce'
            : slot.moonUp
            ? quality > 0.6
              ? `rgba(52,39,206,${0.4 + quality * 0.4})`
              : `rgba(30,20,80,${0.3 + quality * 0.3})`
            : '#ffffff08'

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${height}px`,
                borderRadius: '3px',
                background: barColor,
                transition: 'height 0.3s ease',
                boxShadow: isNext ? '0 0 8px #3427ce88' : 'none',
              }}
            />
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <small style={{ color: 'var(--secondary)', fontSize: '0.65rem' }}>
          {slots[0] ? formatHour(slots[0].time) : ''}
        </small>
        <small style={{ color: 'var(--secondary)', fontSize: '0.65rem' }}>
          {slots[slots.length - 1] ? formatHour(slots[slots.length - 1].time) : ''}
        </small>
      </div>
    </div>
  )
}

export default ViewingWindow