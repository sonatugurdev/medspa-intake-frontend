import { theme as defaultTheme, STEP_CONFIG } from '../utils/constants'
import { usePractice } from '../contexts/PracticeContext'

// Resolve theme: explicit prop > context > default
function useResolvedTheme(themeProp) {
  try {
    const ctx = usePractice()
    return themeProp || ctx?.theme || defaultTheme
  } catch { return themeProp || defaultTheme }
}

export function PrimaryButton({ label, onClick, disabled, style, theme: themeProp }) {
  const t = useResolvedTheme(themeProp)
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: 16, background: disabled ? t.s300 : t.teal,
      color: disabled ? t.s500 : 'white', border: 'none', borderRadius: 14,
      fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s, transform 0.1s',
      letterSpacing: '0.01em', ...style,
    }}>
      {label}
    </button>
  )
}

export function BottomBar({ children, theme: themeProp }) {
  const t = useResolvedTheme(themeProp)
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: t.white,
      padding: '12px 24px 20px', borderTop: `1px solid ${t.s100}`, zIndex: 10,
    }}>
      {children}
    </div>
  )
}

export function StepHeader({ step, totalSteps, onBack, canGoBack, stepConfig, theme: themeProp }) {
  const t = useResolvedTheme(themeProp)
  const config = stepConfig || STEP_CONFIG
  const current = config[step] || {}
  const pct = ((step + 1) / totalSteps) * 100

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: t.s200 }}>
        <div style={{
          height: '100%', background: `linear-gradient(90deg, ${t.teal}, ${t.primaryLight || '#14B8A6'})`,
          width: `${pct}%`, transition: 'width 0.4s ease', borderRadius: 2,
        }} />
      </div>

      {/* Header */}
      <div style={{
        background: t.white, padding: '14px 24px 12px', display: 'flex',
        alignItems: 'center', gap: 12, borderBottom: `1px solid ${t.s100}`,
      }}>
        <button
          onClick={onBack}
          disabled={!canGoBack}
          style={{
            width: 32, height: 32, borderRadius: '50%', background: t.s100,
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: t.s700, flexShrink: 0, cursor: canGoBack ? 'pointer' : 'default',
            opacity: canGoBack ? 1 : 0, pointerEvents: canGoBack ? 'auto' : 'none',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: t.teal, textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Step {step + 1} of {totalSteps}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.s900, lineHeight: 1.3 }}>
            {current.title || ''}
          </div>
        </div>
        <span style={{ fontSize: 12, color: t.s400, fontWeight: 500, whiteSpace: 'nowrap' }}>
          {step + 1} / {totalSteps}
        </span>
      </div>
    </div>
  )
}

export function SkipLink({ onClick, theme: themeProp }) {
  const t = useResolvedTheme(themeProp)
  return (
    <div onClick={onClick} style={{
      textAlign: 'center', marginTop: 10, fontSize: 13, color: t.s400, cursor: 'pointer',
    }}>
      Skip for now
    </div>
  )
}

// Legacy exports for backward compat with ScoreRevealScreen
export function Toggle({ active, onToggle, label }) {
  const t = useResolvedTheme()
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: `1px solid ${t.border}`,
    }}>
      <span style={{ fontSize: 15, color: t.text }}>{label}</span>
      <button onClick={onToggle} style={{
        width: 48, height: 28, borderRadius: 14, background: active ? t.teal : t.s300,
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
  const t = useResolvedTheme()
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
      borderRadius: 20, background: t.tealBg, color: t.teal, fontSize: 13, fontWeight: 500,
      margin: '0 6px 8px 0',
    }}>
      {text}
      {onRemove && <span onClick={onRemove} style={{ cursor: 'pointer', fontSize: 16, lineHeight: 1, opacity: 0.7 }}>×</span>}
    </span>
  )
}

export function SectionCard({ title, children }) {
  const t = useResolvedTheme()
  return (
    <div style={{
      background: t.surface, borderRadius: 12, border: `1px solid ${t.s200}`, padding: 18, marginBottom: 16,
    }}>
      {title && (
        <div style={{
          fontSize: 13, fontWeight: 600, color: t.s400, textTransform: 'uppercase',
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
  const t = useResolvedTheme()
  const color = score >= 80 ? t.green : score >= 60 ? t.teal : score >= 40 ? t.amber : t.red
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', margin: '0 auto',
      background: `conic-gradient(${color} ${score * 3.6}deg, ${t.s200} 0deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%', background: t.s50,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size * 0.31, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 13, color: t.s400 }}>out of 100</span>
      </div>
    </div>
  )
}

export function SelectableCard({ selected, icon, title, description, onClick }) {
  const t = useResolvedTheme()
  return (
    <div onClick={onClick} style={{
      padding: '16px 18px', borderRadius: 12,
      border: `2px solid ${selected ? t.teal : t.s200}`,
      background: selected ? t.tealBg : t.surface,
      cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex',
      alignItems: 'center', gap: 14, marginBottom: 10,
    }}>
      <div style={{
        fontSize: 24, width: 44, height: 44, borderRadius: 10, display: 'flex',
        alignItems: 'center', justifyContent: 'center', background: t.s100, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.s900 }}>{title}</div>
        {description && <div style={{ fontSize: 13, color: t.s500, marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `2px solid ${selected ? t.teal : t.s200}`,
        background: selected ? t.teal : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.2s ease', color: 'white', fontSize: 14,
      }}>
        {selected && '✓'}
      </div>
    </div>
  )
}
