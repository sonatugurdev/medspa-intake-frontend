import { theme } from '../utils/constants'

export default function ThankYouScreen() {
  return (
    <div className="fade-in" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', textAlign: 'center', padding: '40px 24px',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: `${theme.success}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: 24,
      }}>
        ✓
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: theme.secondary, marginBottom: 8 }}>
        You're All Set!
      </h2>

      <p style={{ fontSize: 15, color: theme.textLight, lineHeight: 1.6, maxWidth: 300 }}>
        Your provider will review your skin analysis and personalized recommendations before your appointment.
      </p>

      <div style={{
        background: theme.surface, borderRadius: 12,
        border: `1px solid ${theme.border}`, padding: 18,
        marginTop: 28, width: '100%', maxWidth: 320,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 8 }}>
          What happens next?
        </div>
        <div style={{ fontSize: 13, color: theme.textLight, lineHeight: 1.6 }}>
          Your practitioner will use your skin analysis to prepare a customized treatment plan.
          They'll discuss the recommendations with you during your visit.
        </div>
      </div>

      <div style={{
        marginTop: 32, padding: '14px 24px', borderRadius: 10,
        background: `${theme.primary}08`, border: `1px solid ${theme.primary}20`,
      }}>
        <div style={{ fontSize: 13, color: theme.primary, fontWeight: 500 }}>
          📅 See you at your appointment!
        </div>
      </div>
    </div>
  )
}
