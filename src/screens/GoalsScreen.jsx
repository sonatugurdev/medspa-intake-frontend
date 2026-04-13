import { theme, TIMELINE_OPTIONS, BUDGET_OPTIONS } from '../utils/constants'

export default function GoalsScreen({ goals, updateGoals }) {
  return (
    <div className="slide-in">
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.s900, marginBottom: 6 }}>Goals & priorities</div>
      <div style={{ fontSize: 14, color: theme.s500, marginBottom: 24, lineHeight: 1.5 }}>
        Help us understand what success looks like for you.
      </div>

      <Field label="What is your biggest skin concern right now?" required>
        <textarea placeholder="e.g. The dark circles under my eyes really bother me…" value={goals.biggestConcern}
          onChange={e => updateGoals('biggestConcern', e.target.value)} style={textareaStyle(90)} />
      </Field>

      <Field label="What are your goals & expectations?">
        <textarea placeholder="e.g. I want to look refreshed, not 'done'…" value={goals.goalsText}
          onChange={e => updateGoals('goalsText', e.target.value)} style={textareaStyle(80)} />
      </Field>

      <Field label="Timeline">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TIMELINE_OPTIONS.map(opt => {
            const sel = goals.timelineType === opt.value
            return (
              <div key={opt.value} onClick={() => updateGoals('timelineType', opt.value)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14,
                background: sel ? theme.tealBg : theme.white, border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 12, cursor: 'pointer', userSelect: 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: sel ? theme.tealDark : theme.s900 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: sel ? theme.tealDark : theme.s500, marginTop: 3, lineHeight: 1.4 }}>{opt.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Field>

      {goals.timelineType === 'event' && (
        <Field label="When is your event?">
          <input type="date" value={goals.eventDate} onChange={e => updateGoals('eventDate', e.target.value)} style={inputStyle} />
        </Field>
      )}

      <Field label="Approximate budget per visit" optional>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BUDGET_OPTIONS.map(opt => {
            const sel = goals.budgetRange === opt.value
            return (
              <div key={opt.value} onClick={() => updateGoals('budgetRange', opt.value)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                background: sel ? theme.tealBg : theme.white, border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 10, cursor: 'pointer',
              }}>
                <Radio selected={sel} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.s900 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: theme.s500 }}>{opt.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Field>
    </div>
  )
}

function Field({ label, required, optional, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
        {label} {required && <span style={{ color: theme.red }}>*</span>}
        {optional && <span style={{ fontWeight: 400, color: theme.s400 }}> (optional)</span>}
      </label>
      {children}
    </div>
  )
}

function Radio({ selected }) {
  return (
    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? theme.teal : theme.s300}`,
      background: selected ? theme.teal : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '13px 14px', border: `1.5px solid ${theme.s200}`, borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white }
const textareaStyle = (h) => ({ ...inputStyle, resize: 'none', minHeight: h, fontFamily: 'inherit' })
