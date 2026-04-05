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
          Best Viewing Window
        </small>
        {best && (
          <small style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>
            {best.time.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })} — {best.cover}% cloud
          </small>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'flex-end',
        height: '48px',
      }}>
        {slots.map((slot, i) => {
          const height = Math.max(4, (1 - slot.cover / 100) * 48)
          const isNext = best && slot.time.getTime() === best.time.getTime()
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${height}px`,
                borderRadius: '3px',
                background: isNext
                  ? 'var(--accent)'
                  : slot.moonUp
                  ? `rgba(255,251,232,${0.15 + (1 - slot.cover / 100) * 0.4})`
                  : '#ffffff10',
                transition: 'height 0.3s ease',
              }}
              title={`${slot.time.getHours()}:00 — ${slot.cover}% clouds`}
            />
          )
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <small style={{ color: 'var(--secondary)', fontSize: '0.65rem' }}>
          {slots[0]?.time.toLocaleTimeString('en-IN', { hour: '2-digit', hour12: true })}
        </small>
        <small style={{ color: 'var(--secondary)', fontSize: '0.65rem' }}>
          {slots[slots.length - 1]?.time.toLocaleTimeString('en-IN', { hour: '2-digit', hour12: true })}
        </small>
      </div>
    </div>
  )
}

export default ViewingWindow