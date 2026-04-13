import { useRef, useEffect, useState, useCallback } from 'react'
import { theme } from '../utils/constants'

const CONSENT_ITEMS = [
  {
    key: 'photoConsent', title: 'Photo Consent', required: true,
    body: 'I consent to Glowa AI capturing and storing clinical photographs for the purposes of AI skin analysis, treatment planning, and monitoring progress. Photos will not be used for marketing without separate written consent.',
  },
  {
    key: 'hipaaConsent', title: 'HIPAA Acknowledgment', required: true,
    body: 'I acknowledge that I have received and reviewed the Notice of Privacy Practices. I understand how my protected health information may be used and disclosed, and I consent to this practice\'s HIPAA-compliant handling of my data.',
  },
  {
    key: 'sideEffectsConsent', title: 'Side Effects & Risks', required: true,
    body: 'I understand that aesthetic treatments carry inherent risks including but not limited to bruising, swelling, infection, asymmetry, and rarely, more serious complications. I confirm that I have been given the opportunity to ask questions and will discuss specific treatment risks before any procedure.',
  },
  {
    key: 'commsConsent', title: 'Email & SMS Communication', required: false,
    body: 'I consent to receiving appointment reminders, treatment follow-up messages, and personalised skin tips via email and/or SMS. I can opt out at any time.',
  },
  {
    key: 'marketingConsent', title: 'Marketing & Promotions', required: false,
    body: 'I consent to receiving occasional news, promotions, and skin health content from this practice. I can unsubscribe at any time.',
  },
]

export default function ConsentScreen({ consent, toggleConsent, updateConsent }) {
  return (
    <div className="slide-in">
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.s900, marginBottom: 6 }}>Consent & agreements</div>
      <div style={{ fontSize: 14, color: theme.s500, marginBottom: 24, lineHeight: 1.5 }}>
        Please review and confirm the following before your consultation.
      </div>

      {CONSENT_ITEMS.map(item => (
        <div key={item.key} style={{
          background: theme.white, border: `1.5px solid ${item.required ? theme.tealLight : theme.s200}`,
          borderRadius: 12, padding: 14, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <div
              onClick={() => toggleConsent(item.key)}
              style={{
                width: 22, height: 22, border: `2px solid ${consent[item.key] ? theme.teal : theme.s300}`,
                borderRadius: 5, flexShrink: 0, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                background: consent[item.key] ? theme.teal : 'transparent', marginTop: 1,
              }}
            >
              {consent[item.key] && <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.s900, flex: 1 }}>{item.title}</div>
            {item.required && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: theme.red, background: theme.redBg,
                padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap',
              }}>Required</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: theme.s600, lineHeight: 1.6, paddingLeft: 34 }}>
            {item.body}
          </div>
        </div>
      ))}

      {/* Signature divider */}
      <div style={{
        fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
        color: theme.s400, margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ flex: 1, height: 1, background: theme.s200 }} />
        Signature
        <div style={{ flex: 1, height: 1, background: theme.s200 }} />
      </div>

      {/* Signature pad */}
      <SignaturePad onSignatureChange={(data) => updateConsent('signatureData', data)} />

      {/* Typed name fallback */}
      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          Or type your full name
        </label>
        <input
          type="text"
          placeholder="Sarah Chen"
          value={consent.typedName}
          onChange={e => updateConsent('typedName', e.target.value)}
          style={{
            width: '100%', padding: '13px 14px', border: `1.5px solid ${theme.s200}`,
            borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white,
          }}
        />
      </div>

      <div style={{ fontSize: 11, color: theme.s400, lineHeight: 1.5, textAlign: 'center', marginTop: 12 }}>
        By submitting this form you confirm the information provided is accurate to the best of your knowledge.
      </div>
    </div>
  )
}

function SignaturePad({ onSignatureChange }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSig, setHasSig] = useState(false)

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const src = e.touches ? e.touches[0] : e
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY }
  }, [])

  const startDraw = useCallback((e) => {
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    setDrawing(true)
    const p = getPos(e)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }, [getPos])

  const draw = useCallback((e) => {
    e.preventDefault()
    if (!drawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const p = getPos(e)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    if (!hasSig) {
      setHasSig(true)
      onSignatureChange(canvasRef.current.toDataURL('image/png'))
    }
  }, [drawing, getPos, hasSig, onSignatureChange])

  const stopDraw = useCallback(() => {
    setDrawing(false)
    if (hasSig && canvasRef.current) {
      onSignatureChange(canvasRef.current.toDataURL('image/png'))
    }
  }, [hasSig, onSignatureChange])

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
    onSignatureChange(null)
  }, [onSignatureChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = theme.navy
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  return (
    <div style={{ background: theme.white, border: `1.5px solid ${theme.s200}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{
        padding: '10px 14px', fontSize: 12, color: theme.s500,
        borderBottom: `1px solid ${theme.s100}`, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Sign with your finger or stylus</span>
        <span onClick={clear} style={{ fontSize: 12, color: theme.teal, cursor: 'pointer', fontWeight: 600 }}>Clear</span>
      </div>
      <canvas
        ref={canvasRef}
        width={342}
        height={100}
        style={{ display: 'block', width: '100%', height: 100, cursor: 'crosshair', touchAction: 'none' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
    </div>
  )
}
