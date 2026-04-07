import { theme, GOALS } from '../utils/constants'

export default function ReviewScreen({ goals, history, photo }) {
  const selectedGoals = GOALS.filter(g => goals.includes(g.id))

  return (
    <div>
      <h2 style={{
        fontSize: 22, fontWeight: 700, color: theme.text,
        marginBottom: 8,
      }}>
        Review Your Intake
      </h2>
      <p style={{
        fontSize: 14, color: theme.textLight, lineHeight: 1.5,
        marginBottom: 24,
      }}>
        Make sure everything looks right before we analyze.
      </p>

      {/* Goals */}
      <div style={{
        background: theme.surface, borderRadius: 12,
        border: `1px solid ${theme.border}`, padding: 18, marginBottom: 16,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
        }}>
          Treatment Goals
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {selectedGoals.map(g => (
            <span key={g.id} style={{
              fontSize: 13, padding: '6px 12px', borderRadius: 8,
              background: `${theme.primary}10`, color: theme.primary,
              fontWeight: 500,
            }}>
              {g.icon} {g.label}
            </span>
          ))}
        </div>
      </div>

      {/* Medical History */}
      <div style={{
        background: theme.surface, borderRadius: 12,
        border: `1px solid ${theme.border}`, padding: 18, marginBottom: 16,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
        }}>
          Medical History
        </div>
        <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.8 }}>
          <div>
            <strong>Medications:</strong>{' '}
            {history.medications.length > 0
              ? history.medications.join(', ')
              : 'None'}
          </div>
          <div>
            <strong>Allergies:</strong>{' '}
            {history.allergies.length > 0
              ? history.allergies.join(', ')
              : 'None'}
          </div>
          <div>
            <strong>Pregnant/Nursing:</strong>{' '}
            {history.pregnant ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>HSV History:</strong>{' '}
            {history.herpes ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Recent Procedures:</strong>{' '}
            {history.recentProcedure ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Photo */}
      <div style={{
        background: theme.surface, borderRadius: 12,
        border: `1px solid ${theme.border}`, padding: 18, marginBottom: 16,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
        }}>
          Your Photo
        </div>
        {photo ? (
          <div style={{
            width: '100%', maxWidth: 200, margin: '0 auto',
            borderRadius: 12, overflow: 'hidden',
            border: `2px solid ${theme.success}40`,
          }}>
            <img
              src={photo}
              alt="Your photo"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: 20,
            color: theme.textMuted, fontSize: 14,
          }}>
            No photo captured
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{
        fontSize: 12, color: theme.textMuted, lineHeight: 1.5,
        textAlign: 'center', marginTop: 8,
      }}>
        By submitting, your photo will be analyzed by AI to generate a skin health report.
        Your provider will review the results before your appointment.
      </div>
    </div>
  )
}
