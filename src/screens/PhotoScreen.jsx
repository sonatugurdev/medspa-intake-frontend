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

const SUB_STEPS = [
  { key: 'front', label: 'Front', instruction: 'Look straight at the camera' },
  { key: 'left', label: 'Left 45°', instruction: 'Turn your head slightly to the right so we see your left side' },
  { key: 'right', label: 'Right 45°', instruction: 'Turn your head slightly to the left so we see your right side' },
]

/**
 * PhotoScreen — 3-step photo capture:
 *   1. Frontal via MakeupAR JS Camera Kit (HD skin analysis grade)
 *   2. Left 45° via getUserMedia + canvas (pose guide overlay)
 *   3. Right 45° via getUserMedia + canvas (pose guide overlay)
 *
 * Frontal is required for analysis. Side angles are optional
 * and stored for practitioner reference only.
 */
export default function PhotoScreen({
  photo, setPhoto,
  photoLeft, setPhotoLeft,
  photoRight, setPhotoRight,
}) {
  // Sub-step: 0 = front, 1 = left, 2 = right
  const [subStep, setSubStep] = useState(() => photo ? 1 : 0)

  const images = {
    front: photo || null,
    left: photoLeft || null,
    right: photoRight || null,
  }

  const setters = {
    front: setPhoto,
    left: setPhotoLeft,
    right: setPhotoRight,
  }

  const handleCapture = useCallback((key, dataUrl) => {
    setters[key](dataUrl)
    // Auto-advance after capture (except on last step)
    if (key === 'front') setSubStep(1)
    else if (key === 'left') setSubStep(2)
  }, [setPhoto, setPhotoLeft, setPhotoRight])

  const handleRetake = useCallback((key) => {
    setters[key](null)
  }, [setPhoto, setPhotoLeft, setPhotoRight])

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 8 }}>
        Capture Your Photos
      </h2>
      <p style={{ fontSize: 14, color: theme.textLight, lineHeight: 1.5, marginBottom: 20 }}>
        {subStep === 0
          ? 'Start with a clear frontal photo — the camera will guide you.'
          : 'Side angle photos are optional but help your practitioner.'}
      </p>

      {/* Sub-step indicator */}
      <SubStepIndicator current={subStep} images={images} onSelect={setSubStep} />

      {/* Tips (only on frontal) */}
      {subStep === 0 && (
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
      )}

      {/* Step content */}
      {subStep === 0 ? (
        <FrontalCapture
          image={images.front}
          onCapture={(url) => handleCapture('front', url)}
          onRetake={() => handleRetake('front')}
        />
      ) : (
        <SideCapture
          key={SUB_STEPS[subStep].key}
          side={SUB_STEPS[subStep].key}
          label={SUB_STEPS[subStep].label}
          instruction={SUB_STEPS[subStep].instruction}
          image={images[SUB_STEPS[subStep].key]}
          onCapture={(url) => handleCapture(SUB_STEPS[subStep].key, url)}
          onRetake={() => handleRetake(SUB_STEPS[subStep].key)}
          onSkip={subStep < 2 ? () => setSubStep(subStep + 1) : null}
        />
      )}
    </div>
  )
}


// ─── Sub-step Indicator ───────────────────────────────────────

function SubStepIndicator({ current, images, onSelect }) {
  return (
    <div style={{
      display: 'flex', gap: 8, marginBottom: 20,
      justifyContent: 'center',
    }}>
      {SUB_STEPS.map((s, i) => {
        const captured = !!images[s.key]
        const active = i === current
        return (
          <button
            key={s.key}
            onClick={() => onSelect(i)}
            style={{
              flex: 1, maxWidth: 120,
              padding: '10px 8px',
              background: active ? `${theme.primary}10` : theme.surface,
              border: `2px solid ${active ? theme.primary : captured ? theme.success : theme.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: active ? theme.primary : captured ? theme.success : theme.textMuted,
              marginBottom: 2,
            }}>
              {captured ? '✓ ' : ''}{s.label}
            </div>
            <div style={{
              fontSize: 10,
              color: active ? theme.primary : theme.textMuted,
            }}>
              {i === 0 ? 'Required' : 'Optional'}
            </div>
          </button>
        )
      })}
    </div>
  )
}


// ─── Frontal Capture (MakeupAR Camera Kit) ────────────────────
// This is the original MakeupAR flow, extracted as a sub-component.

function FrontalCapture({ image, onCapture, onRetake }) {
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [sdkError, setSdkError] = useState(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [qualityStatus, setQualityStatus] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let mounted = true

    function setupEventListeners() {
      if (!window.YMK || !mounted) return
      console.log('[CameraKit] Setting up event listeners')

      window.YMK.addEventListener('loaded', function () {
        console.log('[CameraKit] loaded event fired')
        if (mounted) setSdkLoaded(true)
      })

      window.YMK.addEventListener('faceQualityChanged', function (q) {
        if (mounted) setQualityStatus(q)
      })

      window.YMK.addEventListener('faceDetectionCaptured', function (result) {
        console.log('[CameraKit] Captured:', result.images?.length, 'images')
        if (!mounted || !result.images || result.images.length === 0) return

        const img = result.images[0]

        if (typeof img.image === 'string') {
          const dataUrl = img.image.startsWith('data:')
            ? img.image
            : `data:image/jpeg;base64,${img.image}`
          onCapture(dataUrl)
        } else {
          const reader = new FileReader()
          reader.onload = () => {
            if (!mounted) return
            onCapture(reader.result)
            setCameraOpen(false)
            try { window.YMK.close() } catch (e) { /* */ }
          }
          reader.readAsDataURL(img.image)
          return
        }

        setCameraOpen(false)
        try { window.YMK.close() } catch (e) { /* */ }
      })

      window.YMK.addEventListener('cameraFailed', function (error) {
        console.error('[CameraKit] Camera failed:', error)
        if (mounted) {
          setSdkError(`Camera access failed: ${error}`)
          setCameraOpen(false)
        }
      })

      window.YMK.addEventListener('closed', function () {
        if (mounted) setCameraOpen(false)
      })

      try {
        if (window.YMK.isLoaded && window.YMK.isLoaded()) {
          console.log('[CameraKit] Already loaded')
          if (mounted) setSdkLoaded(true)
        }
      } catch (e) { /* isLoaded may not exist yet */ }

      setTimeout(() => {
        if (mounted && window.YMK) {
          console.log('[CameraKit] Timeout fallback — enabling')
          setSdkLoaded(true)
        }
      }, 2000)
    }

    window.ymkAsyncInit = function () {
      console.log('[CameraKit] ymkAsyncInit called by SDK')
      setupEventListeners()
    }

    if (window.YMK) {
      console.log('[CameraKit] YMK already available')
      setupEventListeners()
    }

    if (!document.querySelector('script[src*="makeupar.com"]')) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://plugins-media.makeupar.com/v2.2-camera-kit/sdk.js'
      script.onload = () => {
        console.log('[CameraKit] script onload fired')
        setTimeout(() => {
          if (mounted && window.YMK) setupEventListeners()
        }, 500)
      }
      script.onerror = () => {
        console.error('[CameraKit] Script failed to load')
        if (mounted) setSdkError('Camera Kit failed to load. You can upload a photo instead.')
      }
      document.head.appendChild(script)
    } else {
      console.log('[CameraKit] Script already in DOM')
      setTimeout(() => {
        if (mounted && window.YMK) setupEventListeners()
      }, 300)
    }

    return () => {
      mounted = false
      if (window.YMK && typeof window.YMK.close === 'function') {
        try { window.YMK.close() } catch (e) { /* */ }
      }
    }
  }, [])

  const openCamera = useCallback(() => {
    if (!window.YMK) {
      setSdkError('Camera Kit not available')
      return
    }

    const vw = Math.min(window.innerWidth, 430)
    const vh = window.innerHeight
    const camWidth = Math.min(vw - 40, 340)
    const camHeight = Math.min(vh - 280, 440)

    window.YMK.init({
      faceDetectionMode: 'hdskincare',
      imageFormat: 'base64',
      language: 'enu',
      width: camWidth,
      height: camHeight,
    })
    window.YMK.openCameraKit()
    setCameraOpen(true)
    setQualityStatus(null)
  }, [])

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onCapture(reader.result)
    reader.readAsDataURL(file)
  }, [onCapture])

  // Camera Kit mount point
  const ymkModule = <div id="YMK-module" style={{ display: cameraOpen ? 'block' : 'none' }} />

  if (image) {
    return (
      <div style={{ textAlign: 'center' }}>
        {ymkModule}
        <PhotoPreview src={image} label="Frontal photo captured" />
        <button onClick={onRetake} style={retakeBtnStyle}>Retake Photo</button>
      </div>
    )
  }

  if (cameraOpen) {
    return (
      <div style={{ textAlign: 'center' }}>
        {ymkModule}
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
          onClick={() => { window.YMK.close(); setCameraOpen(false) }}
          style={{ ...retakeBtnStyle, marginTop: 12 }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {ymkModule}
      <div style={{
        width: '100%', maxWidth: 360, margin: '0 auto',
        aspectRatio: '3/4', borderRadius: 16,
        background: '#f0ede8',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ fontSize: 48, opacity: 0.3 }}>📸</div>
        <div style={{ fontSize: 14, color: theme.textMuted, padding: '0 20px', textAlign: 'center' }}>
          {sdkLoaded
            ? 'Tap below to open the guided camera'
            : sdkError ? sdkError : 'Loading camera...'}
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
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

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%', maxWidth: 360, padding: '12px 24px',
            background: 'transparent', border: `2px solid ${theme.border}`,
            borderRadius: 12, fontSize: 14, fontWeight: 600,
            color: theme.textLight, cursor: 'pointer',
          }}
        >
          Or upload a photo
        </button>
        <input
          ref={fileInputRef} type="file" accept="image/jpeg,image/png"
          capture="user" onChange={handleFileUpload} style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}


// ─── Side Angle Capture (getUserMedia) ────────────────────────

function SideCapture({ side, label, instruction, image, onCapture, onRetake, onSkip }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const fileInputRef = useRef(null)

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
    } catch (err) {
      console.error('[SideCapture] Camera error:', err)
      setCameraError('Could not access camera. Try uploading a photo instead.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera])

  const capture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')

    // Mirror the capture to match preview (front camera is mirrored)
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    onCapture(dataUrl)
    stopCamera()
  }, [onCapture, stopCamera])

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onCapture(reader.result)
    reader.readAsDataURL(file)
  }, [onCapture])

  if (image) {
    return (
      <div style={{ textAlign: 'center' }}>
        <PhotoPreview src={image} label={`${label} captured`} />
        <button onClick={onRetake} style={retakeBtnStyle}>Retake</button>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Instruction */}
      <div style={{
        background: `${theme.accent}10`,
        borderRadius: 12, padding: 14, marginBottom: 20,
        borderLeft: `4px solid ${theme.accent}`,
      }}>
        <div style={{ fontSize: 13, color: theme.text, fontWeight: 600, marginBottom: 4 }}>
          {label} photo
        </div>
        <div style={{ fontSize: 13, color: theme.textLight, lineHeight: 1.5 }}>
          {instruction}
        </div>
      </div>

      {cameraActive ? (
        /* Live viewfinder */
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100%', maxWidth: 360, margin: '0 auto',
            borderRadius: 16, overflow: 'hidden',
            border: `2px solid ${theme.primary}`,
            position: 'relative',
            aspectRatio: '3/4',
            background: '#000',
          }}>
            <video
              ref={videoRef}
              playsInline muted
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)', // mirror front camera
              }}
            />
            {/* Pose guide overlay */}
            <PoseGuide side={side} />
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={capture} style={{
              padding: '14px 32px',
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
              color: 'white', border: 'none', borderRadius: 12,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
            }}>
              Capture
            </button>
            <button onClick={stopCamera} style={retakeBtnStyle}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Pre-camera state */
        <>
          <div style={{
            width: '100%', maxWidth: 360, margin: '0 auto',
            aspectRatio: '3/4', borderRadius: 16,
            background: '#f0ede8',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
            position: 'relative', overflow: 'hidden',
          }}>
            <PoseGuide side={side} isStatic />
            <div style={{ fontSize: 14, color: theme.textMuted, zIndex: 1 }}>
              {cameraError || `Capture your ${label.toLowerCase()} angle`}
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <button onClick={startCamera} style={{
              width: '100%', maxWidth: 360, padding: '16px 24px',
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
              color: 'white', border: 'none', borderRadius: 12,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
            }}>
              Open Camera
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', maxWidth: 360, padding: '12px 24px',
                background: 'transparent', border: `2px solid ${theme.border}`,
                borderRadius: 12, fontSize: 14, fontWeight: 600,
                color: theme.textLight, cursor: 'pointer',
              }}
            >
              Or upload a photo
            </button>
            <input
              ref={fileInputRef} type="file" accept="image/jpeg,image/png"
              capture="user" onChange={handleFileUpload} style={{ display: 'none' }}
            />

            {onSkip && (
              <button onClick={onSkip} style={{
                padding: '8px 20px', background: 'transparent', border: 'none',
                fontSize: 13, color: theme.textMuted, cursor: 'pointer',
                textDecoration: 'underline',
              }}>
                Skip this angle
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}


// ─── Pose Guide Overlay ──────────────────────────────────────

function PoseGuide({ side, isStatic }) {
  // SVG silhouette showing the angle the patient should adopt.
  // "left" means we want to see their LEFT cheek → they turn head to the right.
  // "right" means we want to see their RIGHT cheek → they turn head to the left.
  // The video is already mirrored via scaleX(-1), so we apply the visual
  // rotation in the direction that looks correct to the patient.
  const rotation = side === 'left' ? -35 : 35

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      opacity: isStatic ? 0.12 : 0.25,
    }}>
      <svg viewBox="0 0 200 260" width="180" height="234" style={{ transform: `rotateY(${rotation}deg)` }}>
        {/* Simple head + neck silhouette */}
        <ellipse cx="100" cy="100" rx="65" ry="80"
          fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="6 4" />
        <line x1="80" y1="175" x2="80" y2="230"
          stroke="white" strokeWidth="2.5" strokeDasharray="6 4" />
        <line x1="120" y1="175" x2="120" y2="230"
          stroke="white" strokeWidth="2.5" strokeDasharray="6 4" />
        {/* Center line for nose direction */}
        <line x1="100" y1="60" x2="100" y2="140"
          stroke="white" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.5" />
      </svg>
    </div>
  )
}


// ─── Shared Components ───────────────────────────────────────

function PhotoPreview({ src, label }) {
  return (
    <div style={{
      width: '100%', maxWidth: 360, margin: '0 auto',
      borderRadius: 16, overflow: 'hidden',
      border: `3px solid ${theme.success}`,
      position: 'relative',
    }}>
      <img src={src} alt={label} style={{ width: '100%', display: 'block' }} />
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: theme.success, color: 'white',
        borderRadius: 20, padding: '6px 14px',
        fontSize: 12, fontWeight: 600,
      }}>
        {label}
      </div>
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

const retakeBtnStyle = {
  marginTop: 16, padding: '10px 24px',
  background: 'transparent', border: `2px solid ${theme.border}`,
  borderRadius: 10, fontSize: 14, fontWeight: 600,
  color: theme.textLight, cursor: 'pointer',
}
