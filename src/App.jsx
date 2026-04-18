return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <StickyHeader visible={stickyVisible} />

      {/* Top section */}
      <div
        ref={topSectionRef}
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: topOpacity,
          transition: 'filter 0.04s linear, opacity 0.04s linear',
          willChange: 'filter, opacity',
        }}
      >
        {/* Header with rounded bottom corners */}
        <div
          ref={horizonRef}
          style={{
            background: 'var(--black)',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
            paddingBottom: '4px',
          }}
        >
          {/* Pill horizon strip — 5px from edges */}
          <div style={{
            margin: '8px 5px 0',
            borderRadius: '100px',
            overflow: 'hidden',
            background: '#ffffff08',
          }}>
            <HorizonStrip heading={heading} moonAzimuth={moonData?.azimuth} />
          </div>

          <div style={{
            padding: '12px 20px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--secondary)',
                letterSpacing: '0.04em',
                marginBottom: '2px',
              }}>
                {day}, {date}
              </div>
              <div style={{
                fontFamily: 'Funnel Display, sans-serif',
                fontWeight: 475,
                fontSize: '1.6rem',
                color: 'var(--text)',
                letterSpacing: '0.01em',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'baseline',
              }}>
                <span>{hours}:{minutes}</span>
                <span style={{ color: 'var(--primary)' }}>:{seconds}</span>
              </div>
            </div>

            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '4px',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '22px',
                  height: '2px',
                  background: 'var(--text)',
                  borderRadius: '2px',
                }} />
              ))}
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0 24px',
          gap: '4px',
        }}>
          <LockOnRing
            isLocked={isLocked}
            offsetX={offsetX}
            offsetY={offsetY}
            size="95vw"
          />

          <p style={{
            fontFamily: 'Funnel Display, sans-serif',
            fontWeight: '700',
            fontSize: '1.1rem',
            letterSpacing: '0.06em',
            color: isLocked ? 'var(--accent)' : 'var(--text)',
            opacity: isLocked ? 1 : 0.7,
            transition: 'color 0.4s ease, opacity 0.4s ease',
            textAlign: 'center',
            padding: '4px 20px 0',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            {instruction}
          </p>

          <KPIGrid moonData={moonData} weather={weather} city={city} />
        </div>
      </div>

      {/* Analytics section */}
      <div style={{ paddingTop: '48px' }}>
        <div style={{
          textAlign: 'center',
          padding: '0 20px 28px',
        }}>
          <p style={{
            fontFamily: 'Funnel Display, sans-serif',
            fontWeight: '700',
            fontSize: '0.85rem',
            color: 'var(--secondary)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}>
            Analytics
          </p>
          <div style={{
            width: '32px',
            height: '1px',
            background: 'var(--secondary)',
            margin: '8px auto 0',
            opacity: 0.4,
          }} />
        </div>

        <Dashboard
          moonData={moonData}
          weather={weather}
          heading={heading}
        />

        {/* Footer with concentric rounded top corners */}
        <div style={{
          background: 'var(--primary)',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          marginTop: '8px',
        }}>
          <Footer />
        </div>
      </div>

    </div>
  )