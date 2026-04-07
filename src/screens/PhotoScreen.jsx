import { useState, useEffect, useCallback, useRef } from 'react'

const theme = {
  primary: '#3B8B8A',
  primaryLight: '#5BA8A7',
  text: '#2D2A2E',
  textLight: '#6B6970',
  textMuted: '#9B99A1',
  background: '#FFF8F2',
  surface: '#FFFFFF',
  border: '#E8E5E0',
  success: '#2D8B4E',
  accent: '#D4930D',
  error: '#C43E3E',
}

/**
 * PhotoScreen — uses MakeupAR JS Camera Kit for guided HD skincare capture.
 *
 * The Camera Kit handles:
 * - Camera permission requests
 * - Real-time face detection
 * - Face quality validation (lighting, pose, distance)
 * - Automatic capture when conditions pass
 * - Returns a high-res base64 image
 *
 * Fallback: if Camera Kit fails to load (e.g., unsupported browser),
 * falls back to a simple file input for photo upload.
 */
export default function PhotoScreen({ photo, setPhoto }) {
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [sdkError, setSdkError] = useState(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState(photo || null)
  const [qualityStatus, setQualityStatus] = useState(null)
  const fileInputRef = useRef(null)

  // Load the MakeupAR JS Camera Kit SDK
  useEffect(() => {
    // Define the async init callback before loading script
    window.ymkAsyncInit = function () {
      window.YMK.addEventListener('loaded', function () {
        console.log('[CameraKit] SDK loaded and ready')
        setSdkLoaded(true)
      })

      window.YMK.addEventListener('faceQualityChanged', function (q) {
        setQualityStatus(q)
      })

      window.YMK.addEventListener('faceDetectionCaptured', function (result) {
        console.log('[CameraKit] Photo captured:', result.images?.length, 'images')
        if (result.images && result.images.length > 0) {
          const img = result.images[0]
          let dataUrl

          if (typeof img.image === 'string') {
            // base64 string — may or may not have data URL prefix
            dataUrl = img.image.startsWith('data:')
              ? img.image
              : `data:image/jpeg;base64,${img.image}`
          } else {
            // Blob — convert to data URL
            const reader = new FileReader()
            reader.onload = () => {
              setCapturedImage(reader.result)
              setPhoto(reader.result)
              setCameraOpen(false)
              window.YMK.close()
            }
            reader.readAsDataURL(img.image)
            return
          }

          setCapturedImage(dataUrl)
          setPhoto(dataUrl)
          setCameraOpen(false)
          window.YMK.close()
        }
      })

      window.YMK.addEventListener('cameraFailed', function (error) {
        console.error('[CameraKit] Camera failed:', error)
        setSdkError(`Camera access failed: ${error}`)
        setCameraOpen(false)
      })

      window.YMK.addEventListener('closed', function () {
        setCameraOpen(false)
      })
    }

    // Load SDK script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://plugins-media.makeupar.com/v2.2-camera-kit/sdk.js'
    script.onerror = () => {
      console.error('[CameraKit] Failed to load SDK')
      setSdkError('Camera Kit SDK failed to load. You can upload a photo instead.')
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (window.YMK && typeof window.YMK.close === 'function') {
        try { window.YMK.close() } catch (e) { /* ignore */ }
      }
    }
  }, [])

  const openCamera = useCallback(() => {
    if (!window.YMK) {
      setSdkError('Camera Kit not available')
      return
    }

    window.YMK.init({
      faceDetectionMode: 'hdskincare',
      imageFormat: 'base64',
      language: 'enu',
    })
    window.YMK.openCameraKit()
    setCameraOpen(true)
    setQualityStatus(null)
  }, [])

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setCapturedImage(reader.result)
      setPhoto(reader.result)
    }
    reader.readAsDataURL(file)
  }, [setPhoto])

  const retake = useCallback(() => {
    setCapturedImage(null)
    setPhoto(null)
    setQualityStatus(null)
  }, [setPhoto])

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{
        fontSize: 22, fontWeight: 700, color: theme.text,
        marginBottom: 8,
      }}>
        Capture Your Photo
      </h2>
      <p style={{
        fontSize: 14, color: theme.textLight, lineHeight: 1.5,
        marginBottom: 24,
      }}>
        One clear frontal photo is all we need. The camera will guide you for the best result.
      </p>

      {/* Tips */}
      <div style={{
        background: `${theme.primary}08`,
        borderRadius: 12, padding: 16, marginBottom: 24,
        borderLeft: `4px solid ${theme.primary}`,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: theme.primary,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
        }}>
          For best results
        </div>
        <div style={{ fontSize: 13, color: theme.textLight, lineHeight: 1.6 }}>
          Remove glasses and pull hair back from your forehead. Good, even lighting helps — avoid harsh shadows or backlight. No makeup gives the most accurate analysis.
        </div>
      </div>

      {/* Camera Kit mount point (required by SDK) */}
      <div id="YMK-module" style={{ display: cameraOpen ? 'block' : 'none' }} />

      {/* Main content area */}
      {capturedImage ? (
        // Show captured photo
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '100%', maxWidth: 360, margin: '0 auto',
            borderRadius: 16, overflow: 'hidden',
            border: `3px solid ${theme.success}`,
            position: 'relative',
          }}>
            <img
              src={capturedImage}
              alt="Captured photo"
              style={{ width: '100%', display: 'block' }}
            />
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: theme.success, color: 'white',
              borderRadius: 20, padding: '6px 14px',
              fontSize: 12, fontWeight: 600,
            }}>
              Photo captured
            </div>
          </div>

          <button
            onClick={retake}
            style={{
              marginTop: 16, padding: '10px 24px',
              background: 'transparent',
              border: `2px solid ${theme.border}`,
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: theme.textLight, cursor: 'pointer',
            }}
          >
            Retake Photo
          </button>
        </div>
      ) : !cameraOpen ? (
        // Show capture buttons
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '100%', maxWidth: 360, margin: '0 auto',
            aspectRatio: '3/4', borderRadius: 16,
            background: '#f0ede8',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>📸</div>
            <div style={{ fontSize: 14, color: theme.textMuted, padding: '0 20px', textAlign: 'center' }}>
              {sdkLoaded
                ? 'Tap below to open the guided camera'
                : sdkError
                  ? sdkError
                  : 'Loading camera...'}
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            {/* Primary: Camera Kit */}
            <button
              onClick={openCamera}
              disabled={!sdkLoaded}
              style={{
                width: '100%', maxWidth: 360, padding: '16px 24px',
                background: sdkLoaded
                  ? `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`
                  : theme.border,
                color: sdkLoaded ? 'white' : theme.textMuted,
                border: 'none', borderRadius: 12,
                fontSize: 16, fontWeight: 700,
                cursor: sdkLoaded ? 'pointer' : 'not-allowed',
              }}
            >
              {sdkLoaded ? 'Open Camera' : 'Loading Camera...'}
            </button>

            {/* Fallback: file upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', maxWidth: 360, padding: '12px 24px',
                background: 'transparent',
                border: `2px solid ${theme.border}`,
                borderRadius: 12, fontSize: 14, fontWeight: 600,
                color: theme.textLight, cursor: 'pointer',
              }}
            >
              Or upload a photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              capture="user"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      ) : (
        // Camera is open — SDK renders its own UI in #YMK-module
        <div style={{ textAlign: 'center' }}>
          {qualityStatus && (
            <div style={{
              marginTop: 16, padding: 12,
              background: theme.surface, borderRadius: 10,
              border: `1px solid ${theme.border}`,
              fontSize: 13, color: theme.textLight,
            }}>
              <QualityIndicator quality={qualityStatus} />
            </div>
          )}
          <button
            onClick={() => {
              window.YMK.close()
              setCameraOpen(false)
            }}
            style={{
              marginTop: 12, padding: '10px 24px',
              background: 'transparent',
              border: `2px solid ${theme.border}`,
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: theme.textLight, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}


function QualityIndicator({ quality }) {
  const items = [
    { label: 'Face detected', ok: quality.hasFace },
    { label: 'Position', ok: quality.position === 'good' },
    { label: 'Facing forward', ok: quality.frontal === 'good' },
    { label: 'Lighting', ok: quality.lighting === 'good' || quality.lighting === 'ok' },
  ]

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {items.map(({ label, ok }) => (
        <span key={label} style={{
          fontSize: 12, color: ok ? theme.success : theme.accent,
          fontWeight: 600,
        }}>
          {ok ? '✓' : '○'} {label}
        </span>
      ))}
    </div>
  )
}
