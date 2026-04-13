import { theme, DEFAULT_CONCERNS } from '../utils/constants'

export default function ConcernsScreen({ concerns, toggleConcern, concernsFreeText, setConcernsFreeText }) {
  const isSelected = (key) => concerns.some(c => c.key === key)

  return (
    <div className="slide-in">
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.s900, marginBottom: 6 }}>
        What brings you in?
      </div>
      <div style={{ fontSize: 14, color: theme.s500, marginBottom: 24, lineHeight: 1.5 }}>
        Select all that apply. We'll tailor your consultation to what matters most to you.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {DEFAULT_CONCERNS.map(c => {
          const sel = isSelected(c.key)
          return (
            <div
              key={c.key}
              onClick={() => toggleConcern(c.key, c.label)}
              style={{
                background: sel ? theme.tealBg : theme.white,
                border: `1.5px solid ${sel ? theme.teal : theme.s200}`,
                borderRadius: 12, padding: '12px 10px', cursor: 'pointer',
                textAlign: 'center', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, position: 'relative',
                transition: 'all 0.15s', userSelect: 'none',
              }}
            >
              {sel && (
                <div style={{
                  position: 'absolute', top: 8, right: 8, width: 18, height: 18,
                  background: theme.teal, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white',
                }}>✓</div>
              )}
              <div style={{ fontSize: 12, color: sel ? theme.teal : theme.s700, fontWeight: sel ? 600 : 500, lineHeight: 1.3 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 10, color: sel ? theme.tealDark : theme.s400, lineHeight: 1.3 }}>
                {c.sub}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          Anything else you'd like us to know?
        </label>
        <textarea
          placeholder="e.g. I have a wedding in 3 months…"
          value={concernsFreeText}
          onChange={e => setConcernsFreeText(e.target.value)}
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
