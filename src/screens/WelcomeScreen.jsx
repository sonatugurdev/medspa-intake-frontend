import { theme } from '../utils/constants'
import { PrimaryButton } from '../components/UI'

export default function WelcomeScreen({ onStart }) {
  const steps = ['Share your goals', 'Quick medical history', '3 guided photos', 'Instant skin analysis']

  return (
    <div className="fade-in" style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      minHeight: '100vh', textAlign: 'center', padding: '40px 24px',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
        margin: '0 auto 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, color: 'white',
        boxShadow: `0 8px 24px ${theme.primary}40`,
      }}>
        ✦
      </div>

      <h1 style={{
        fontSize: 28, fontWeight: 700, color: theme.secondary,
        letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8,
      }}>
        Welcome to Your<br />Skin Consultation
      </h1>

      <p style={{
        fontSize: 15, color: theme.textLight, maxWidth: 300,
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
              background: `${theme.primary}15`, color: theme.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 15, color: theme.text }}>{item}</span>
          </div>
        ))}
      </div>

      <PrimaryButton
        label="Begin Intake →"
        onClick={onStart}
        style={{ maxWidth: 320, margin: '0 auto' }}
      />

      <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 16 }}>
        Your information is private and HIPAA-compliant
      </p>
    </div>
  )
}
