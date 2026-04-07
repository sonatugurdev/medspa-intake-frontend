import { useState, useEffect } from 'react'
import { theme } from '../utils/constants'
import { ScoreCircle } from '../components/UI'
import AnnotatedFaceViewer from '../components/AnnotatedFaceViewer'

const ZONE_LABELS = {
  forehead: 'Forehead',
  periorbital: 'Eye Area',
  midface: 'Cheeks',
  perioral: 'Mouth Area',
  jawline_neck: 'Jawline',
}

export default function ScoreRevealScreen({ result, frontalPhoto }) {
  const [revealed, setRevealed] = useState(false)
  const [activeTab, setActiveTab] = useState('findings') // 'findings' | 'zones'

  useEffect(() => {
    setTimeout(() => setRevealed(true), 300)
  }, [])

  const analysis = result?.skin_analysis || result || {}
  const summary = result?.patient_summary || analysis.patient_summary || {}
  const zones = analysis.zones || {}
  const overall = analysis.overall_skin_health || 72
  const skinAge = summary.estimated_skin_age || '—'
  const headline = summary.headline || 'Your skin analysis is ready'
  const strengths = summary.strengths || []
  const improvements = summary.areas_for_improvement || []
  const findings = analysis.visual_findings || []

  const scoreColor = (score) => {
    if (score >= 80) return theme.success
    if (score >= 60) return theme.primary
    if (score >= 40) return theme.accent
    return theme.error
  }

  const wrinkleColor = (w) => {
    if (w <= 1) return theme.success
    if (w <= 2) return theme.accent
    return theme.error
  }

  return (
    <div style={{
      padding: '24px 20px', paddingBottom: 120,
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease',
    }}>
      {/* Score + Skin Age */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16,
        }}>
          Your Skin Health Score
        </div>
        <ScoreCircle score={overall} />
        <div style={{ fontSize: 14, color: theme.textLight, marginTop: 16 }}>
          Estimated skin age: <strong style={{ color: theme.primary }}>{skinAge}</strong>
        </div>
      </div>

      {/* Headline */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary}10, ${theme.primaryLight}08)`,
        borderRadius: 12, padding: 18, marginBottom: 20,
        borderLeft: `4px solid ${theme.primary}`,
      }}>
        <p style={{ fontSize: 15, color: theme.text, lineHeight: 1.5, margin: 0 }}>
          {headline}
        </p>
      </div>

      {/* Strengths & Improvements */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {strengths.length > 0 && (
            <div style={{ flex: 1, background: `${theme.success}08`, borderRadius: 12, padding: 14 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: theme.success,
                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
              }}>
                Strengths
              </div>
              {strengths.map((s, i) => (
                <div key={i} style={{ fontSize: 13, color: theme.text, marginBottom: 4, display: 'flex', gap: 6 }}>
                  <span style={{ color: theme.success, flexShrink: 0 }}>✓</span> {s}
                </div>
              ))}
            </div>
          )}
          {improvements.length > 0 && (
            <div style={{ flex: 1, background: `${theme.accent}08`, borderRadius: 12, padding: 14 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: theme.accent,
                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
              }}>
                Focus Areas
              </div>
              {improvements.map((s, i) => (
                <div key={i} style={{ fontSize: 13, color: theme.text, marginBottom: 4, display: 'flex', gap: 6 }}>
                  <span style={{ color: theme.accent, flexShrink: 0 }}>→</span> {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        background: theme.surfaceAlt,
        borderRadius: 10,
        padding: 3,
        marginBottom: 20,
      }}>
        {[
          { id: 'findings', label: 'Visual Analysis' },
          { id: 'zones', label: 'Zone Scores' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 8,
              border: 'none',
              background: activeTab === tab.id ? theme.surface : 'transparent',
              color: activeTab === tab.id ? theme.text : theme.textMuted,
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 600 : 400,
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Analysis Tab */}
      {activeTab === 'findings' && (
        <AnnotatedFaceViewer
          photoDataUrl={frontalPhoto}
          findings={findings}
          faceBounds={analysis.face_bounds || null}
        />
      )}

      {/* Zone Scores Tab */}
      {activeTab === 'zones' && Object.keys(zones).length > 0 && (
        <div style={{
          background: theme.surface, borderRadius: 12,
          border: `1px solid ${theme.border}`, padding: 18,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: theme.textMuted,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14,
          }}>
            Zone Breakdown
          </div>
          {Object.entries(zones).map(([zone, scores]) => (
            <div key={zone}>
              <div style={{
                display: 'flex', alignItems: 'center', padding: '12px 0',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  flex: 1, fontSize: 14, fontWeight: 600, color: theme.text,
                }}>
                  {ZONE_LABELS[zone] || zone.replace('_', ' ')}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <div style={{ textAlign: 'center', minWidth: 36 }}>
                    <div style={{ fontWeight: 600, color: scoreColor(scores.texture_score || 0) }}>
                      {scores.texture_score || '—'}
                    </div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>Texture</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 36 }}>
                    <div style={{ fontWeight: 600, color: scoreColor(scores.pigmentation_score || 0) }}>
                      {scores.pigmentation_score || '—'}
                    </div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>Tone</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 36 }}>
                    <div style={{ fontWeight: 600, color: scoreColor(scores.hydration_estimate || 0) }}>
                      {scores.hydration_estimate || '—'}
                    </div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>Hydration</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 36 }}>
                    <div style={{ fontWeight: 600, color: wrinkleColor(scores.wrinkle_depth_index || 0) }}>
                      {scores.wrinkle_depth_index?.toFixed(1) || '—'}
                    </div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>Lines</div>
                  </div>
                </div>
              </div>
              {scores.notes && (
                <div style={{
                  fontSize: 12, color: theme.textLight, padding: '6px 0 8px',
                  fontStyle: 'italic', lineHeight: 1.4,
                }}>
                  {scores.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cross-view observations */}
      {analysis.cross_view_observations?.length > 0 && (
        <div style={{
          background: theme.surfaceAlt, borderRadius: 12, padding: 16, marginTop: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: theme.textMuted,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
          }}>
            Multi-Angle Insights
          </div>
          {analysis.cross_view_observations.map((obs, i) => (
            <div key={i} style={{ fontSize: 13, color: theme.text, marginBottom: 6, display: 'flex', gap: 6 }}>
              <span style={{ color: theme.primary, flexShrink: 0 }}>◆</span> {obs}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
