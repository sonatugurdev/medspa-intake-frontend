import { theme, ALLERGY_TOGGLES, LIFESTYLE_CHIPS, TREATMENT_RECENCY_OPTIONS } from '../utils/constants'

export default function AllergiesLifestyleScreen({ allergiesLifestyle, toggleAllergy, toggleLifestyleFactor, updateAllergiesLifestyle }) {
  return (
    <div className="slide-in">
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.s900, marginBottom: 6 }}>Allergies & lifestyle</div>
      <div style={{ fontSize: 14, color: theme.s500, marginBottom: 24, lineHeight: 1.5 }}>
        A few more details that help us choose the safest treatments for you.
      </div>

      {/* Known Allergies */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.s500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
          Known Allergies
        </div>
        {ALLERGY_TOGGLES.map(item => (
          <ToggleRow key={item.key} label={item.label} desc={item.desc}
            active={!!allergiesLifestyle.knownAllergies[item.key]}
            onToggle={() => toggleAllergy(item.key)} />
        ))}
      </div>

      {/* Other allergies free text */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          Other allergies or sensitivities
        </label>
        <textarea
          placeholder="List any other known allergies or skin sensitivities…"
          value={allergiesLifestyle.otherAllergies}
          onChange={e => updateAllergiesLifestyle('otherAllergies', e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.s200}`,
            borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white,
            resize: 'none', minHeight: 70, fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Lifestyle factors */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          Lifestyle factors <span style={{ fontWeight: 400, color: theme.s400 }}>(select all that apply)</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LIFESTYLE_CHIPS.map(chip => {
            const sel = allergiesLifestyle.lifestyleFactors.includes(chip)
            return (
              <div key={chip} onClick={() => toggleLifestyleFactor(chip)} style={{
                padding: '8px 14px', border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 20, fontSize: 13, fontWeight: sel ? 600 : 500,
                color: sel ? theme.tealDark : theme.s700, background: sel ? theme.tealBg : theme.white,
                cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s',
              }}>
                {chip}
              </div>
            )
          })}
        </div>
      </div>

      {/* Last aesthetic treatment */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          Last previous aesthetic treatment
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TREATMENT_RECENCY_OPTIONS.map(opt => {
            const sel = allergiesLifestyle.lastTreatmentRecency === opt.value
            return (
              <div key={opt.value} onClick={() => updateAllergiesLifestyle('lastTreatmentRecency', opt.value)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                background: sel ? theme.tealBg : theme.white, border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 10, cursor: 'pointer', userSelect: 'none',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${sel ? theme.teal : theme.s300}`,
                  background: sel ? theme.teal : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {sel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: theme.s900 }}>{opt.label}</div>
              </div>
            )
          })}
        </div>
      </div>
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
