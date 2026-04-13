import { theme, SKIN_TYPES, SPF_OPTIONS, PREVIOUS_TREATMENTS } from '../utils/constants'

export default function SkinProfileScreen({ skinProfile, updateSkinProfile, togglePreviousTreatment }) {
  return (
    <div className="slide-in">
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.s900, marginBottom: 6 }}>Your skin history</div>
      <div style={{ fontSize: 14, color: theme.s500, marginBottom: 24, lineHeight: 1.5 }}>
        Help us understand your skin and current routine.
      </div>

      {/* Skin type */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>How would you describe your skin type?</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SKIN_TYPES.map(opt => {
            const sel = skinProfile.skinType === opt.value
            return (
              <div key={opt.value} onClick={() => updateSkinProfile('skinType', opt.value)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                background: sel ? theme.tealBg : theme.white, border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 10, cursor: 'pointer', userSelect: 'none',
              }}>
                <Radio selected={sel} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: theme.s900 }}>{opt.label}</div>
                  {opt.desc && <div style={{ fontSize: 11, color: theme.s500, marginTop: 2 }}>{opt.desc}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SPF usage */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Do you use SPF daily?</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SPF_OPTIONS.map(opt => {
            const sel = skinProfile.spfUsage === opt.value
            return (
              <div key={opt.value} onClick={() => updateSkinProfile('spfUsage', opt.value)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                background: sel ? theme.tealBg : theme.white, border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 10, cursor: 'pointer', userSelect: 'none',
              }}>
                <Radio selected={sel} />
                <div style={{ fontSize: 14, fontWeight: 500, color: theme.s900 }}>{opt.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Skincare routine */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Current skincare routine</label>
        <textarea
          placeholder="e.g. Cleanser, Vitamin C, moisturiser, SPF in the morning. Cleanser, retinol at night…"
          value={skinProfile.skincareRoutine}
          onChange={e => updateSkinProfile('skincareRoutine', e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.s200}`,
            borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white,
            resize: 'none', minHeight: 90, fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Previous treatments */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Previous professional skin treatments</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PREVIOUS_TREATMENTS.map(t => {
            const sel = skinProfile.previousTreatments.includes(t)
            return (
              <div key={t} onClick={() => togglePreviousTreatment(t)} style={{
                padding: '8px 14px', border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 20, fontSize: 13, fontWeight: sel ? 600 : 500,
                color: sel ? theme.tealDark : theme.s700, background: sel ? theme.tealBg : theme.white,
                cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s',
              }}>
                {t}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Radio({ selected }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? theme.teal : theme.s300}`,
      background: selected ? theme.teal : 'transparent', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>
      {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
    </div>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }
