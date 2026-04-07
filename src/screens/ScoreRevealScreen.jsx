import { useState, useEffect } from 'react'

const theme = {
  primary: '#3B8B8A',
  primaryLight: '#5BA8A7',
  text: '#2D2A2E',
  textLight: '#6B6970',
  textMuted: '#9B99A1',
  background: '#FFF8F2',
  surface: '#FFFFFF',
  border: '#E8E5E0',
  success: '#2D8B4E',
  accent: '#D4930D',
  error: '#C43E3E',
}

const scoreColor = (score) =>
  score >= 80 ? theme.success : score >= 60 ? theme.accent : theme.error

const WRINKLE_ZONE_LABELS = {
  forehead: 'Forehead',
  glabellar: 'Glabellar (11s)',
  crowfeet: "Crow's Feet",
  periocular: 'Under-Eye',
  nasolabial: 'Nasolabial',
  marionette: 'Marionette',
  whole: 'Overall',
}

const PORE_ZONE_LABELS = {
  forehead: 'Forehead',
  nose: 'Nose',
  cheek: 'Cheeks',
  whole: 'Overall',
}

const CONCERN_CONFIG = {
  hd_wrinkle: { label: 'Wrinkles', color: '#E85D75', icon: '〰️' },
  hd_pore: { label: 'Pores', color: '#5B8DEF', icon: '◌' },
  hd_acne: { label: 'Acne', color: '#EF8B5B', icon: '●' },
  hd_age_spot: { label: 'Spots', color: '#C49B3C', icon: '◉' },
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'


export default function ScoreRevealScreen({ result, frontalPhoto }) {
  const [revealed, setRevealed] = useState(false)
  const [activeTab, setActiveTab] = useState('facemap')

  useEffect(() => {
    setTimeout(() => setRevealed(true), 300)
  }, [])

  const analysis = result?.skin_analysis || result || {}
  const overall = analysis.overall_skin_health || 75
  const skinAge = analysis.skin_age || 30
  const headline = analysis.headline || 'Analysis complete'
  const strengths = analysis.strengths || []
  const improvements = analysis.improvements || []
  const cvScores = analysis.cv_scores || {}
  const maskUrls = analysis.mask_urls || {}
  const clinicalObs = analysis.clinical_observations || []
  const treatmentRecs = analysis.treatment_considerations || []
  const contraindications = analysis.contraindications || []
  const fitzpatrick = analysis.fitzpatrick || {}
  const glogau = analysis.glogau || {}

  const hasMasks = Object.keys(maskUrls).some(k => maskUrls[k]?.length > 0)

  const tabs = [
    ...(hasMasks || frontalPhoto ? [{ id: 'facemap', label: 'Face Map' }] : []),
    { id: 'overview', label: 'Overview' },
    { id: 'zones', label: 'Zones' },
    { id: 'clinical', label: 'Clinical' },
  ]

  return (
    <div style={{
      padding: '0 20px',
      paddingBottom: 120,
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease',
    }}>
      {/* Score Header */}
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
        {fitzpatrick.type && (
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
            Fitzpatrick Type {fitzpatrick.type} ({fitzpatrick.label})
            {glogau.type ? ` · Glogau Type ${glogau.type}` : ''}
          </div>
        )}
      </div>

      {/* Headline */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary}10, ${theme.primaryLight}08)`,
        borderRadius: 12, padding: 18, marginBottom: 20,
        borderLeft: `4px solid ${theme.primary}`,
      }}>
        <p style={{ fontSize: 15, color: theme.text, lineHeight: 1.5, margin: 0 }}>{headline}</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        background: theme.border + '40', borderRadius: 10, padding: 3,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '10px 6px',
              background: activeTab === tab.id ? theme.surface : 'transparent',
              border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? theme.primary : theme.textLight,
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'facemap' && (
        <FaceMapTab frontalPhoto={frontalPhoto} maskUrls={maskUrls} cvScores={cvScores} />
      )}
      {activeTab === 'overview' && (
        <OverviewTab strengths={strengths} improvements={improvements} cvScores={cvScores} contraindications={contraindications} />
      )}
      {activeTab === 'zones' && <ZoneDetailsTab cvScores={cvScores} />}
      {activeTab === 'clinical' && (
        <ClinicalTab clinicalObs={clinicalObs} treatmentRecs={treatmentRecs} glogau={glogau} />
      )}
    </div>
  )
}


// ─── Face Map Tab (CSS img layering — no CORS issues) ───────────

function FaceMapTab({ frontalPhoto, maskUrls, cvScores }) {
  const [activeConcern, setActiveConcern] = useState(null)
  const [maskOpacity, setMaskOpacity] = useState(0.6)
  const [maskLoadState, setMaskLoadState] = useState({})
  const [useFallback, setUseFallback] = useState({})

  const availableConcerns = Object.keys(maskUrls).filter(k => maskUrls[k]?.length > 0)

  useEffect(() => {
    if (availableConcerns.length > 0 && !activeConcern) {
      setActiveConcern(availableConcerns[0])
    }
  }, [availableConcerns.length])

  const getScore = (concern) => {
    if (!concern || !cvScores) return null
    const data = cvScores[concern]
    if (!data) return null
    if (data.whole?.ui_score != null) return data.whole.ui_score
    if (data.ui_score != null) return data.ui_score
    return null
  }

  const getMaskSrc = (concern) => {
    const urls = maskUrls[concern]
    if (!urls || urls.length === 0) return null
    const directUrl = urls[0]
    if (useFallback[concern]) {
      return `${API_BASE_URL}/api/mask-proxy?url=${encodeURIComponent(directUrl)}`
    }
    return directUrl
  }

  const handleMaskLoad = (concern) => {
    setMaskLoadState(prev => ({ ...prev, [concern]: 'loaded' }))
  }

  const handleMaskError = (concern) => {
    if (!useFallback[concern]) {
      console.warn(`[FaceMap] Direct mask URL failed for ${concern}, trying proxy...`)
      setUseFallback(prev => ({ ...prev, [concern]: true }))
    } else {
      console.warn(`[FaceMap] Proxy also failed for ${concern}`)
      setMaskLoadState(prev => ({ ...prev, [concern]: 'error' }))
    }
  }

  const activeScore = getScore(activeConcern)
  const activeConfig = activeConcern ? CONCERN_CONFIG[activeConcern] : null

  return (
    <>
      {/* Photo + Mask Overlay */}
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${theme.border}`, marginBottom: 16,
        position: 'relative', background: '#1a1a1a',
      }}>
        {activeConfig && (
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 8, padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>{activeConfig.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{activeConfig.label}</span>
            {activeScore != null && (
              <span style={{
                fontSize: 12, fontWeight: 700, color: scoreColor(activeScore),
                background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 6px',
              }}>{activeScore}</span>
            )}
          </div>
        )}

        {frontalPhoto ? (
          <div style={{ position: 'relative' }}>
            <img
              src={frontalPhoto}
              alt="Your photo"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
            {availableConcerns.map(concern => {
              const src = getMaskSrc(concern)
              if (!src) return null
              const isActive = concern === activeConcern
              return (
                <img
                  key={concern + (useFallback[concern] ? '-proxy' : '')}
                  src={src}
                  alt={`${concern} overlay`}
                  onLoad={() => handleMaskLoad(concern)}
                  onError={() => handleMaskError(concern)}
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    opacity: isActive ? maskOpacity : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}
                />
              )
            })}
          </div>
        ) : (
          <div style={{
            aspectRatio: '3/4', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: theme.textMuted, fontSize: 14,
          }}>
            Photo not available
          </div>
        )}
      </div>

      {/* Concern Toggle Buttons */}
      {availableConcerns.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(availableConcerns.length, 4)}, 1fr)`,
          gap: 8, marginBottom: 12,
        }}>
          {availableConcerns.map(concern => {
            const config = CONCERN_CONFIG[concern] || { label: concern, color: theme.primary, icon: '◎' }
            const isActive = activeConcern === concern
            const score = getScore(concern)
            const state = maskLoadState[concern]
            return (
              <button
                key={concern}
                onClick={() => setActiveConcern(isActive ? null : concern)}
                style={{
                  padding: '10px 6px',
                  background: isActive ? `${config.color}15` : theme.surface,
                  border: `2px solid ${isActive ? config.color : theme.border}`,
                  borderRadius: 10, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 4,
                  transition: 'all 0.2s ease',
                  opacity: state === 'error' ? 0.4 : 1,
                }}
              >
                <span style={{ fontSize: 16 }}>{config.icon}</span>
                <span style={{
                  fontSize: 11, fontWeight: isActive ? 700 : 500,
                  color: isActive ? config.color : theme.textLight,
                }}>{config.label}</span>
                {score != null && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(score) }}>{score}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Opacity Slider */}
      {activeConcern && maskLoadState[activeConcern] !== 'error' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 16, padding: '0 4px',
        }}>
          <span style={{ fontSize: 11, color: theme.textMuted, whiteSpace: 'nowrap' }}>Overlay</span>
          <input
            type="range" min="0" max="100"
            value={Math.round(maskOpacity * 100)}
            onChange={e => setMaskOpacity(parseInt(e.target.value) / 100)}
            style={{ flex: 1, height: 4, accentColor: theme.primary }}
          />
          <span style={{ fontSize: 11, color: theme.textMuted, minWidth: 32, textAlign: 'right' }}>
            {Math.round(maskOpacity * 100)}%
          </span>
        </div>
      )}

      {availableConcerns.length === 0 && frontalPhoto && (
        <div style={{
          background: `${theme.primary}08`, borderRadius: 10, padding: 14,
          marginBottom: 16, fontSize: 13, color: theme.textLight, textAlign: 'center',
        }}>
          Skin concern overlays were not available for this analysis. Check the Zone Details tab for your scores.
        </div>
      )}
    </>
  )
}


// ─── Shared Components ──────────────────────────────────────────

function ScoreCircle({ score }) {
  return (
    <div style={{
      width: 140, height: 140, borderRadius: '50%', margin: '0 auto',
      background: `conic-gradient(${theme.primary} ${score * 3.6}deg, ${theme.border} 0deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: theme.background, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 44, fontWeight: 700, color: theme.primary, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 13, color: theme.textMuted }}>out of 100</span>
      </div>
    </div>
  )
}

function ScoreBar({ label, score, compact = false }) {
  const color = scoreColor(score)
  return (
    <div style={{ marginBottom: compact ? 8 : 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: compact ? 12 : 13, color: theme.text, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: compact ? 12 : 13, color, fontWeight: 700 }}>{score}</span>
      </div>
      <div style={{ height: compact ? 4 : 6, borderRadius: 3, background: theme.border, overflow: 'hidden' }}>
        <div style={{
          width: `${score}%`, height: '100%', borderRadius: 3,
          background: color, transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}


// ─── Overview Tab ───────────────────────────────────────────────

function OverviewTab({ strengths, improvements, cvScores, contraindications }) {
  // Handle both nested (zone breakdown) and flat (direct ui_score) formats
  const getOverall = (data) => {
    if (!data) return null
    if (data.whole?.ui_score != null) return data.whole.ui_score
    if (data.ui_score != null) return data.ui_score
    return null
  }
  const wrinkleWhole = getOverall(cvScores?.hd_wrinkle)
  const poreWhole = getOverall(cvScores?.hd_pore)
  const acneScore = getOverall(cvScores?.hd_acne)
  const ageSpotScore = getOverall(cvScores?.hd_age_spot)

  return (
    <>
      {(wrinkleWhole || poreWhole || acneScore || ageSpotScore) && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: theme.textMuted,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
          }}>Skin analysis scores</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
            {wrinkleWhole != null && <ScoreBar label="Wrinkles" score={wrinkleWhole} compact />}
            {poreWhole != null && <ScoreBar label="Pores" score={poreWhole} compact />}
            {acneScore != null && <ScoreBar label="Acne" score={acneScore} compact />}
            {ageSpotScore != null && <ScoreBar label="Age Spots" score={ageSpotScore} compact />}
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 8 }}>
            Higher score = healthier skin in that area
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {strengths.length > 0 && (
          <div style={{ flex: 1, background: `${theme.success}08`, borderRadius: 12, padding: 14 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: theme.success,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
            }}>Strengths</div>
            {strengths.map((s, i) => (
              <div key={i} style={{ fontSize: 13, color: theme.text, marginBottom: 6, display: 'flex', gap: 6 }}>
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
            }}>Opportunities</div>
            {improvements.map((s, i) => (
              <div key={i} style={{ fontSize: 13, color: theme.text, marginBottom: 6, display: 'flex', gap: 6 }}>
                <span style={{ color: theme.accent, flexShrink: 0 }}>→</span> {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {contraindications.length > 0 && (
        <div style={{
          background: `${theme.error}08`, borderRadius: 12, padding: 14,
          border: `1px solid ${theme.error}30`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: theme.error,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
          }}>Medical alerts</div>
          {contraindications.map((c, i) => (
            <div key={i} style={{
              fontSize: 13, color: theme.text, marginBottom: 8, paddingBottom: 8,
              borderBottom: i < contraindications.length - 1 ? `1px solid ${theme.error}15` : 'none',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                <span style={{
                  fontSize: 10, padding: '2px 6px', borderRadius: 4,
                  background: c.severity === 'ABSOLUTE' ? theme.error : theme.accent,
                  color: 'white', marginRight: 6,
                }}>{c.severity}</span>
                {c.name}
              </div>
              <div style={{ fontSize: 12, color: theme.textLight }}>{c.message}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}


// ─── Zone Details Tab ───────────────────────────────────────────

function ZoneDetailsTab({ cvScores }) {
  // Helper: check if a scores object has zone breakdowns (nested dicts with ui_score)
  // vs being a flat score object itself (has ui_score at top level)
  const hasZones = (obj) => {
    if (!obj || typeof obj !== 'object') return false
    // If it has ui_score directly, it's a flat score — no zones
    if ('ui_score' in obj) return false
    // If it has keys that are objects with ui_score, it has zones
    return Object.values(obj).some(v => v && typeof v === 'object' && 'ui_score' in v)
  }

  const wrinkleData = cvScores?.hd_wrinkle || {}
  const poreData = cvScores?.hd_pore || {}
  const acneData = cvScores?.hd_acne || {}
  const ageSpotData = cvScores?.hd_age_spot || {}

  const wrinkleHasZones = hasZones(wrinkleData)
  const poreHasZones = hasZones(poreData)

  // Extract overall scores regardless of format
  const getOverall = (data) => {
    if (!data) return null
    if (data.whole?.ui_score != null) return data.whole.ui_score
    if (data.ui_score != null) return data.ui_score
    return null
  }

  const wrinkleOverall = getOverall(wrinkleData)
  const poreOverall = getOverall(poreData)
  const acneScore = getOverall(acneData)
  const ageSpotScore = getOverall(ageSpotData)

  return (
    <>
      {/* Wrinkle zones */}
      {wrinkleOverall != null && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
            Wrinkle Analysis{wrinkleHasZones ? ' by Zone' : ''}
          </div>
          {wrinkleHasZones ? (
            <>
              {Object.entries(wrinkleData)
                .filter(([zone, v]) => zone !== 'whole' && v && typeof v === 'object' && 'ui_score' in v)
                .sort(([, a], [, b]) => (a.ui_score || 0) - (b.ui_score || 0))
                .map(([zone, data]) => (
                  <ScoreBar key={zone} label={WRINKLE_ZONE_LABELS[zone] || zone} score={data.ui_score} compact />
                ))}
              {wrinkleData.whole && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${theme.border}` }}>
                  <ScoreBar label="Overall Wrinkle Score" score={wrinkleData.whole.ui_score} />
                </div>
              )}
            </>
          ) : (
            <ScoreBar label="Wrinkle Score" score={wrinkleOverall} />
          )}
        </div>
      )}

      {/* Pore zones */}
      {poreOverall != null && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
            Pore Analysis{poreHasZones ? ' by Zone' : ''}
          </div>
          {poreHasZones ? (
            <>
              {Object.entries(poreData)
                .filter(([zone, v]) => zone !== 'whole' && v && typeof v === 'object' && 'ui_score' in v)
                .sort(([, a], [, b]) => (a.ui_score || 0) - (b.ui_score || 0))
                .map(([zone, data]) => (
                  <ScoreBar key={zone} label={PORE_ZONE_LABELS[zone] || zone} score={data.ui_score} compact />
                ))}
              {poreData.whole && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${theme.border}` }}>
                  <ScoreBar label="Overall Pore Score" score={poreData.whole.ui_score} />
                </div>
              )}
            </>
          ) : (
            <ScoreBar label="Pore Score" score={poreOverall} />
          )}
        </div>
      )}

      {/* Acne & Age Spots */}
      {(acneScore != null || ageSpotScore != null) && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
            Other Skin Concerns
          </div>
          {acneScore != null && <ScoreBar label="Acne" score={acneScore} />}
          {ageSpotScore != null && <ScoreBar label="Age Spots" score={ageSpotScore} />}
        </div>
      )}
    </>
  )
}


// ─── Clinical Tab ───────────────────────────────────────────────

function ClinicalTab({ clinicalObs, treatmentRecs, glogau }) {
  return (
    <>
      {glogau?.type && (
        <div style={{ background: `${theme.primary}08`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: theme.primary,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
          }}>Photoaging Classification</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
            Glogau Type {glogau.type}: {glogau.label}
          </div>
          {glogau.description && (
            <div style={{ fontSize: 13, color: theme.textLight }}>{glogau.description}</div>
          )}
        </div>
      )}

      {clinicalObs.length > 0 && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12 }}>
            Clinical Observations
          </div>
          {clinicalObs.map((obs, i) => (
            <div key={i} style={{
              padding: '10px 0',
              borderBottom: i < clinicalObs.length - 1 ? `1px solid ${theme.border}` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                  {obs.category?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
                <SeverityBadge severity={obs.severity} />
              </div>
              <div style={{ fontSize: 12, color: theme.textLight }}>
                {obs.zone && <span style={{ fontWeight: 500 }}>{obs.zone} — </span>}
                {obs.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {treatmentRecs.length > 0 && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12 }}>
            Treatment Considerations
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 12, fontStyle: 'italic' }}>
            For discussion with your provider — not a prescription
          </div>
          {treatmentRecs.map((rec, i) => (
            <div key={i} style={{
              padding: '10px 0',
              borderBottom: i < treatmentRecs.length - 1 ? `1px solid ${theme.border}` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{rec.concern}</span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4,
                  background: rec.priority === 'high' ? `${theme.primary}15` : `${theme.textMuted}15`,
                  color: rec.priority === 'high' ? theme.primary : theme.textMuted,
                  fontWeight: 700, textTransform: 'uppercase',
                }}>{rec.priority}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {rec.approaches?.map((approach, j) => (
                  <span key={j} style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 6,
                    background: `${theme.primary}10`, color: theme.primary, fontWeight: 500,
                  }}>{approach}</span>
                ))}
              </div>
              {rec.notes && (
                <div style={{ fontSize: 12, color: theme.textLight, marginTop: 6 }}>{rec.notes}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function SeverityBadge({ severity }) {
  const colors = {
    none: { bg: `${theme.success}15`, color: theme.success },
    mild: { bg: `${theme.accent}15`, color: theme.accent },
    moderate: { bg: `${theme.accent}20`, color: '#B07D0A' },
    severe: { bg: `${theme.error}15`, color: theme.error },
  }
  const c = colors[severity] || colors.mild
  return (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 4,
      background: c.bg, color: c.color, fontWeight: 700, textTransform: 'uppercase',
    }}>{severity || 'mild'}</span>
  )
}
