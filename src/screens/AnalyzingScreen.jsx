import { useState, useEffect } from 'react'
import { theme } from '../utils/constants'

const STEPS = [
  { at: 15, text: 'Analyzing skin texture and tone...' },
  { at: 35, text: 'Examining fine lines and wrinkles...' },
  { at: 55, text: 'Cross-referencing multiple angles...' },
  { at: 75, text: 'Generating your personalized report...' },
  { at: 90, text: 'Almost ready...' },
]

export default function AnalyzingScreen() {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Preparing your photos...')

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 1.5, 95)
        const step = STEPS.find(s => s.at <= next && s.at > p)
        if (step) setStatusText(step.text)
        return next
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', textAlign: 'center', padding: '40px 24px',
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.primary}30, ${theme.primary}05)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 32, animation: 'pulse 2s ease-in-out infinite',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, color: 'white',
        }}>
          ✦
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.secondary, marginBottom: 8 }}>
        Analyzing Your Skin
      </h2>
      <p style={{ fontSize: 14, color: theme.textLight, marginBottom: 28 }}>{statusText}</p>

      <div style={{ width: '80%', height: 6, borderRadius: 3, background: theme.border, overflow: 'hidden' }}>
        <div style={{
          width: `${progress}%`, height: '100%', borderRadius: 3,
          background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryLight})`,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 12 }}>{Math.round(progress)}%</p>
    </div>
  )
}
