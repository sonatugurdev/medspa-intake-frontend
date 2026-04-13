import { theme, STEP_CONFIG } from '../utils/constants'

export function PrimaryButton({ label, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: 16, background: disabled ? theme.s300 : theme.teal,
      color: disabled ? theme.s500 : 'white', border: 'none', borderRadius: 14,
      fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s, transform 0.1s',
      letterSpacing: '0.01em', ...style,
    }}>
      {label}
    </button>
  )
}

export function BottomBar({ children }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: theme.white,
      padding: '12px 24px 20px', borderTop: `1px solid ${theme.s100}`, zIndex: 10,
    }}>
      {children}
    </div>
  )
}

export function StepHeader({ step, totalSteps, onBack, canGoBack, stepConfig }) {
  const config = stepConfig || STEP_CONFIG
  const current = config[step] || {}
  const pct = ((step + 1) / totalSteps) * 100

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: theme.s200 }}>
        <div style={{
          height: '100%', background: `linear-gradient(90deg, ${theme.teal}, #14B8A6)`,
          width: `${pct}%`, transition: 'width 0.4s ease', borderRadius: 2,
        }} />
      </div>

      {/* Header */}
      <div style={{
        background: theme.white, padding: '14px 24px 12px', display: 'flex',
        alignItems: 'center', gap: 12, borderBottom: `1px solid ${theme.s100}`,
      }}>
        <button
          onClick={onBack}
          disabled={!canGoBack}
          style={{
            width: 32, height: 32, borderRadius: '50%', background: theme.s100,
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: theme.s700, flexShrink: 0, cursor: canGoBack ? 'pointer' : 'default',
            opacity: canGoBack ? 1 : 0, pointerEvents: canGoBack ? 'auto' : 'none',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: theme.teal, textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Step {step + 1} of {totalSteps}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.s900, lineHeight: 1.3 }}>
            {current.title || ''}
          </div>
        </div>
        <span style={{ fontSize: 12, color: theme.s400, fontWeight: 500, whiteSpace: 'nowrap' }}>
          {step + 1} / {totalSteps}
        </span>
      </div>
    </div>
  )
}

export function SkipLink({ onClick }) {
  return (
    <div onClick={onClick} style={{
      textAlign: 'center', marginTop: 10, fontSize: 13, color: theme.s400, cursor: 'pointer',
    }}>
      Skip for now
    </div>
  )
}

// Legacy exports for backward compat with ScoreRevealScreen
export function Toggle({ active, onToggle, label }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: `1px solid ${theme.border}`,
    }}>
      <span style={{ fontSize: 15, color: theme.text }}>{label}</span>
      <button onClick={onToggle} style={{
        width: 48, height: 28, borderRadius: 14, background: active ? theme.teal : theme.s300,
        padding: 3, border: 'none', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 11, background: 'white',
          transform: active ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </button>
    </div>
  )
}

export function Tag({ text, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
      borderRadius: 20, background: theme.tealBg, color: theme.teal, fontSize: 13, fontWeight: 500,
      margin: '0 6px 8px 0',
    }}>
      {text}
      {onRemove && <span onClick={onRemove} style={{ cursor: 'pointer', fontSize: 16, lineHeight: 1, opacity: 0.7 }}>×</span>}
    </span>
  )
}

export function SectionCard({ title, children }) {
  return (
    <div style={{
      background: theme.surface, borderRadius: 12, border: `1px solid ${theme.s200}`, padding: 18, marginBottom: 16,
    }}>
      {title && (
        <div style={{
          fontSize: 13, fontWeight: 600, color: theme.s400, textTransform: 'uppercase',
          letterSpacing: 1, marginBottom: 10,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

export function ScoreCircle({ score, size = 140 }) {
  const color = score >= 80 ? theme.green : score >= 60 ? theme.teal : score >= 40 ? theme.amber : theme.red
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', margin: '0 auto',
      background: `conic-gradient(${color} ${score * 3.6}deg, ${theme.s200} 0deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%', background: theme.s50,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size * 0.31, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 13, color: theme.s400 }}>out of 100</span>
      </div>
    </div>
  )
}

export function SelectableCard({ selected, icon, title, description, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: '16px 18px', borderRadius: 12,
      border: `2px solid ${selected ? theme.teal : theme.s200}`,
      background: selected ? theme.tealBg : theme.surface,
      cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex',
      alignItems: 'center', gap: 14, marginBottom: 10,
    }}>
      <div style={{
        fontSize: 24, width: 44, height: 44, borderRadius: 10, display: 'flex',
        alignItems: 'center', justifyContent: 'center', background: theme.s100, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.s900 }}>{title}</div>
        {description && <div style={{ fontSize: 13, color: theme.s500, marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `2px solid ${selected ? theme.teal : theme.s200}`,
        background: selected ? theme.teal : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.2s ease', color: 'white', fontSize: 14,
      }}>
        {selected && '✓'}
      </div>
    </div>
  )
}
