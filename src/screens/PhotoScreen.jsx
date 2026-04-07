import { useState } from 'react'
import { theme, PHOTO_STEPS } from '../utils/constants'
import { PrimaryButton } from '../components/UI'
import { useCamera } from '../hooks/useCamera'

export default function PhotoScreen({ photos, setPhoto, clearPhoto }) {
  const [currentIdx, setCurrentIdx] = useState(
    !photos.frontal ? 0 : !photos.left ? 1 : !photos.right ? 2 : 2
  )
  const camera = useCamera()

  const step = PHOTO_STEPS[currentIdx]
  const allDone = photos.frontal && photos.left && photos.right

  const handleCapture = async () => {
    const dataUrl = await camera.capture()
    if (dataUrl) {
      setPhoto(step.id, dataUrl)
    }
  }

  const handleRetake = () => {
    clearPhoto(step.id)
    camera.stop()
  }

  const handleNext = () => {
    if (currentIdx < 2) setCurrentIdx(currentIdx + 1)
  }

  const handleOpenCamera = async () => {
    const success = await camera.start()
    if (!success) {
      alert('Camera access is needed for skin analysis. Please allow camera access in your browser settings and try again.')
    }
  }

  return (
    <div className="slide-in">
      <h2 style={{ fontSize: 26, fontWeight: 700, color: theme.secondary, marginBottom: 8 }}>
        Capture Your Photos
      </h2>
      <p style={{ fontSize: 15, color: theme.textLight, marginBottom: 24, lineHeight: 1.5 }}>
        3 quick photos for a complete analysis. Good lighting makes a big difference!
      </p>

      {/* Progress indicators */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {PHOTO_STEPS.map((ps, i) => (
          <div
            key={ps.id}
            onClick={() => {
              if (photos[ps.id]) {
                camera.stop()
                setCurrentIdx(i)
              }
            }}
            style={{
              flex: 1, padding: '12px 8px', borderRadius: 10, textAlign: 'center',
              border: `2px solid ${photos[ps.id] ? theme.success : i === currentIdx ? theme.primary : theme.border}`,
              background: photos[ps.id] ? `${theme.success}08` : i === currentIdx ? `${theme.primary}08` : theme.surface,
              cursor: photos[ps.id] ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: 20 }}>{photos[ps.id] ? '✅' : ps.icon}</div>
            <div style={{
              fontSize: 12, fontWeight: 600, marginTop: 4,
              color: photos[ps.id] ? theme.success : theme.text,
            }}>
              {ps.label}
            </div>
          </div>
        ))}
      </div>

      {!allDone && (
        <>
          {/* Camera / Preview Area */}
          <div style={{
            width: '100%', aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden',
            background: '#1a1a1a', position: 'relative', marginBottom: 16,
          }}>
            {camera.active ? (
              <>
                <video
                  ref={camera.videoRef}
                  autoPlay
                  playsInline
                  muted
                  webkit-playsinline=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />
                {/* Face guide overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    width: '65%', height: '75%', borderRadius: '50%',
                    border: `3px solid ${theme.primary}80`,
                    boxShadow: `0 0 0 9999px rgba(0,0,0,0.25)`,
                  }} />
                </div>
                {/* Countdown */}
                {camera.countdown && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.4)',
                    color: 'white', fontSize: 72, fontWeight: 700,
                  }}>
                    {camera.countdown}
                  </div>
                )}
                {/* Instruction bar */}
                <div style={{
                  position: 'absolute', bottom: 16, left: 16, right: 16,
                  textAlign: 'center', background: 'rgba(0,0,0,0.6)',
                  borderRadius: 10, padding: '10px 16px',
                  color: 'white', fontSize: 14, fontWeight: 500,
                }}>
                  {step.instruction}
                </div>
              </>
            ) : photos[step?.id] ? (
              <img
                src={photos[step.id]}
                alt={step.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: '#888',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{step.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{step.label}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{step.instruction}</div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!camera.active && !photos[step?.id] && (
            <PrimaryButton label="📷 Open Camera" onClick={handleOpenCamera} />
          )}

          {camera.active && !camera.countdown && (
            <PrimaryButton label={`Capture ${step.label}`} onClick={handleCapture} />
          )}

          {!camera.active && photos[step?.id] && (
            <div style={{ display: 'flex', gap: 10 }}>
              <PrimaryButton
                label="Retake"
                onClick={handleRetake}
                style={{ background: theme.surfaceAlt, color: theme.text, flex: 1 }}
              />
              <PrimaryButton
                label={currentIdx < 2 ? `Next: ${PHOTO_STEPS[currentIdx + 1].label} →` : 'Done ✓'}
                onClick={handleNext}
                style={{ flex: 2 }}
                disabled={currentIdx >= 2}
              />
            </div>
          )}
        </>
      )}

      {allDone && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: theme.success }}>All 3 photos captured!</div>
          <p style={{ fontSize: 14, color: theme.textLight, marginTop: 8 }}>
            Tap any photo above to retake it.
          </p>
        </div>
      )}
    </div>
  )
}
