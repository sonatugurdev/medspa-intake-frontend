import { theme } from '../utils/constants'

export function PrimaryButton({ label, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 24px',
        borderRadius: 12,
        border: 'none',
        background: disabled ? theme.border : theme.primary,
        color: disabled ? theme.textMuted : 'white',
        fontSize: 16,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        letterSpacing: '0.3px',
        ...style,
      }}
    >
      {label}
    </button>
  )
}

export function BottomBar({ children }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      padding: '16px 20px',
      paddingBottom: 32,
      background: `linear-gradient(transparent, ${theme.bg} 20%)`,
      zIndex: 10,
    }}>
      {children}
    </div>
  )
}

export function StepHeader({ step, totalSteps, onBack, canGoBack }) {
  return (
    <div style={{
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.border}`,
      background: theme.surface,
    }}>
      {canGoBack ? (
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: 24, color: theme.textLight, padding: '4px 8px' }}
        >
          ←
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i < step ? theme.primary : i === step ? theme.primary : theme.border,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
      <div style={{ width: 40, fontSize: 13, color: theme.textMuted, textAlign: 'right' }}>
        {step + 1}/{totalSteps}
      </div>
    </div>
  )
}

export function Toggle({ active, onToggle, label }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <span style={{ fontSize: 15, color: theme.text }}>{label}</span>
      <button
        onClick={onToggle}
        style={{
          width: 48, height: 28, borderRadius: 14,
          background: active ? theme.primary : theme.border,
          padding: 3, border: 'none',
          display: 'flex', alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 11,
          background: 'white',
          transform: active ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </button>
    </div>
  )
}

export function Tag({ text, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 20,
      background: `${theme.primary}12`,
      color: theme.primary,
      fontSize: 13,
      fontWeight: 500,
      margin: '0 6px 8px 0',
    }}>
      {text}
      {onRemove && (
        <span onClick={onRemove} style={{ cursor: 'pointer', fontSize: 16, lineHeight: 1, opacity: 0.7 }}>
          ×
        </span>
      )}
    </span>
  )
}

export function SelectableCard({ selected, icon, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px 18px',
        borderRadius: 12,
        border: `2px solid ${selected ? theme.primary : theme.border}`,
        background: selected ? `${theme.primary}08` : theme.surface,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
      }}
    >
      <div style={{
        fontSize: 24, width: 44, height: 44, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: theme.surfaceAlt, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.secondary }}>{title}</div>
        {description && <div style={{ fontSize: 13, color: theme.textLight, marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `2px solid ${selected ? theme.primary : theme.border}`,
        background: selected ? theme.primary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: 'auto', flexShrink: 0,
        transition: 'all 0.2s ease',
        color: 'white', fontSize: 14,
      }}>
        {selected && '✓'}
      </div>
    </div>
  )
}

export function SectionCard({ title, children }) {
  return (
    <div style={{
      background: theme.surface,
      borderRadius: 12,
      border: `1px solid ${theme.border}`,
      padding: 18,
      marginBottom: 16,
    }}>
      {title && (
        <div style={{
          fontSize: 13, fontWeight: 600, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

export function ScoreCircle({ score, size = 140 }) {
  const color = score >= 80 ? theme.success : score >= 60 ? theme.primary : score >= 40 ? theme.accent : theme.error

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', margin: '0 auto',
      background: `conic-gradient(${color} ${score * 3.6}deg, ${theme.border} 0deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 6,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: theme.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size * 0.31, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 13, color: theme.textMuted }}>out of 100</span>
      </div>
    </div>
  )
}
