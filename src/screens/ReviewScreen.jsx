import { theme, GOALS, PHOTO_STEPS } from '../utils/constants'
import { SectionCard, Tag } from '../components/UI'

export default function ReviewScreen({ goals, history, photos }) {
  const selectedGoals = GOALS.filter(g => goals.includes(g.id))

  return (
    <div className="slide-in">
      <h2 style={{ fontSize: 26, fontWeight: 700, color: theme.secondary, marginBottom: 8 }}>
        Review Your Intake
      </h2>
      <p style={{ fontSize: 15, color: theme.textLight, marginBottom: 28, lineHeight: 1.5 }}>
        Make sure everything looks right before we analyze.
      </p>

      <SectionCard title="Goals">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selectedGoals.map(g => <Tag key={g.id} text={`${g.icon} ${g.label}`} />)}
        </div>
      </SectionCard>

      <SectionCard title="Medical">
        <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.8 }}>
          <div><strong>Medications:</strong> {history.medications.length > 0 ? history.medications.map(m => typeof m === 'object' ? m.name : m).join(', ') : 'None'}</div>
          <div><strong>Allergies:</strong> {history.allergies.length > 0 ? history.allergies.join(', ') : 'None'}</div>
          <div><strong>Pregnant/Nursing:</strong> {history.pregnant ? 'Yes' : 'No'}</div>
          <div><strong>HSV History:</strong> {history.herpes ? 'Yes' : 'No'}</div>
        </div>
      </SectionCard>

      <SectionCard title="Photos">
        <div style={{ display: 'flex', gap: 8 }}>
          {PHOTO_STEPS.map(ps => (
            <div key={ps.id} style={{
              flex: 1, aspectRatio: '3/4', borderRadius: 8,
              overflow: 'hidden', background: '#eee',
            }}>
              {photos[ps.id] && (
                <img src={photos[ps.id]} alt={ps.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
          {PHOTO_STEPS.map(ps => (
            <span key={ps.id} style={{ fontSize: 11, color: theme.textMuted }}>{ps.label}</span>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
