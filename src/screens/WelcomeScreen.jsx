import { theme } from '../utils/constants'

export default function WelcomeScreen({ onStart, practiceName }) {
  const steps = [
    'Tell us about yourself',
    'Share your goals & history',
    'Capture skin photos',
    'Get your AI analysis',
  ]

  return (
    <div className="fade-in" style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      minHeight: '100vh', textAlign: 'center', padding: '40px 24px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: theme.teal, letterSpacing: -1 }}>Glowa</span>
        <span style={{ fontSize: 28, fontWeight: 800, color: theme.navy, letterSpacing: -1 }}>AI</span>
      </div>

      <h1 style={{
        fontSize: 26, fontWeight: 700, color: theme.s900,
        letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8,
      }}>
        Welcome to Your<br />Skin Consultation
      </h1>

      {practiceName && (
        <div style={{ fontSize: 14, color: theme.teal, fontWeight: 600, marginBottom: 8 }}>
          {practiceName}
        </div>
      )}

      <p style={{
        fontSize: 15, color: theme.s500, maxWidth: 300,
        margin: '0 auto 32px', lineHeight: 1.5,
      }}>
        Complete your intake in under 5 minutes. We'll analyze your skin and prepare
        personalized recommendations for your visit.
      </p>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        textAlign: 'left', marginBottom: 32,
      }}>
        {steps.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: theme.tealBg, color: theme.teal,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 15, color: theme.s900 }}>{item}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          width: '100%', maxWidth: 320, margin: '0 auto', padding: '16px 24px',
          background: theme.teal, color: 'white', border: 'none', borderRadius: 14,
          fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.01em',
        }}
      >
        Begin Intake →
      </button>

      <p style={{ fontSize: 12, color: theme.s400, marginTop: 16 }}>
        Your information is private and HIPAA-compliant
      </p>

      {/* Powered by footer */}
      <div style={{ marginTop: 40, fontSize: 11, color: theme.s400 }}>
        Powered by <span style={{ fontWeight: 700, color: theme.teal }}>Glowa</span>
        <span style={{ fontWeight: 700, color: theme.navy }}>AI</span>
      </div>
    </div>
  )
}
