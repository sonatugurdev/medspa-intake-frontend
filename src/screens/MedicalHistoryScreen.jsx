import { theme, CONDITION_TOGGLES, MEDICATION_TOGGLES } from '../utils/constants'

export default function MedicalHistoryScreen({ medicalHistory, toggleCondition, toggleMedicationFlag, updateMedicalHistory }) {
  return (
    <div className="slide-in">
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.s900, marginBottom: 6 }}>Medical history</div>
      <div style={{ fontSize: 14, color: theme.s500, marginBottom: 24, lineHeight: 1.5 }}>
        Your safety is our priority. All information is confidential.
      </div>

      {/* HIPAA info card */}
      <div style={{
        background: theme.tealBg, border: `1px solid ${theme.tealLight}`, borderRadius: 10,
        padding: '12px 14px', marginBottom: 16, fontSize: 13, color: theme.tealDark,
        lineHeight: 1.5, display: 'flex', gap: 8,
      }}>
        <span style={{ flexShrink: 0 }}>🔒</span>
        <div>This information is protected under HIPAA and will only be used by your clinical team.</div>
      </div>

      {/* Conditions */}
      <ToggleSection title="Conditions">
        {CONDITION_TOGGLES.map(item => (
          <ToggleRow key={item.key} label={item.label} desc={item.desc}
            active={!!medicalHistory.conditions[item.key]}
            onToggle={() => toggleCondition(item.key)} />
        ))}
      </ToggleSection>

      {/* Medications & Recent Treatments */}
      <ToggleSection title="Medications & Recent Treatments">
        {MEDICATION_TOGGLES.map(item => (
          <ToggleRow key={item.key} label={item.label} desc={item.desc}
            active={!!medicalHistory.medicationFlags[item.key]}
            onToggle={() => toggleMedicationFlag(item.key)} />
        ))}
      </ToggleSection>

      {/* Reproductive Health */}
      <ToggleSection title="Reproductive Health">
        <ToggleRow label="Currently pregnant or nursing"
          desc="Some treatments are not suitable during pregnancy or breastfeeding"
          active={medicalHistory.pregnantNursing}
          onToggle={() => updateMedicalHistory('pregnantNursing', !medicalHistory.pregnantNursing)} />
      </ToggleSection>

      {/* Free-text medications */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          Current medications <span style={{ fontWeight: 400, color: theme.s400 }}>(list any relevant)</span>
        </label>
        <textarea
          placeholder="e.g. Metformin, Spironolactone, birth control…"
          value={medicalHistory.medicationsText}
          onChange={e => updateMedicalHistory('medicationsText', e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.s200}`,
            borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white,
            resize: 'none', minHeight: 80, fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  )
}

function ToggleSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: theme.s500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, active, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 0', borderBottom: `1px solid ${theme.s100}`, gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: theme.s900 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: theme.s500, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      <div onClick={onToggle} style={{
        position: 'relative', width: 46, height: 26, background: active ? theme.teal : theme.s300,
        borderRadius: 13, cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', width: 22, height: 22, background: 'white', borderRadius: '50%',
          top: 2, left: active ? 22 : 2, transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  )
}
