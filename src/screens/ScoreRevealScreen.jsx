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

// Zone labels for display
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


export default function ScoreRevealScreen({ result, frontalPhoto }) {
  const [revealed, setRevealed] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setTimeout(() => setRevealed(true), 300)
  }, [])

  // Extract data from result
  const analysis = result?.skin_analysis || result || {}
  const overall = analysis.overall_skin_health || 75
  const skinAge = analysis.skin_age || 30
  const headline = analysis.headline || 'Analysis complete'
  const strengths = analysis.strengths || []
  const improvements = analysis.improvements || []
  const cvScores = analysis.cv_scores || {}
  const clinicalObs = analysis.clinical_observations || []
  const treatmentRecs = analysis.treatment_considerations || []
  const contraindications = analysis.contraindications || []
  const fitzpatrick = analysis.fitzpatrick || {}
  const glogau = analysis.glogau || {}

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'zones', label: 'Zone Details' },
    { id: 'clinical', label: 'Clinical' },
  ]

  return (
    <div style={{
      padding: '0 20px',
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease',
    }}>
      {/* Big Score */}
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
        <p style={{ fontSize: 15, color: theme.text, lineHeight: 1.5, margin: 0 }}>
          {headline}
        </p>
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
              flex: 1, padding: '10px 8px',
              background: activeTab === tab.id ? theme.surface : 'transparent',
              border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? theme.primary : theme.textLight,
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <OverviewTab
          strengths={strengths}
          improvements={improvements}
          cvScores={cvScores}
          contraindications={contraindications}
        />
      )}
      {activeTab === 'zones' && (
        <ZoneDetailsTab cvScores={cvScores} />
      )}
      {activeTab === 'clinical' && (
        <ClinicalTab
          clinicalObs={clinicalObs}
          treatmentRecs={treatmentRecs}
          glogau={glogau}
        />
      )}
    </div>
  )
}


// ─── Score Circle Component ─────────────────────────────────────

function ScoreCircle({ score }) {
  return (
    <div style={{
      width: 140, height: 140, borderRadius: '50%', margin: '0 auto',
      background: `conic-gradient(${theme.primary} ${score * 3.6}deg, ${theme.border} 0deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 6,
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


// ─── Score Bar Component ────────────────────────────────────────

function ScoreBar({ label, score, compact = false }) {
  const color = scoreColor(score)
  return (
    <div style={{ marginBottom: compact ? 8 : 12 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: compact ? 12 : 13, color: theme.text, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: compact ? 12 : 13, color, fontWeight: 700 }}>{score}</span>
      </div>
      <div style={{
        height: compact ? 4 : 6, borderRadius: 3,
        background: theme.border, overflow: 'hidden',
      }}>
        <div style={{
          width: `${score}%`, height: '100%', borderRadius: 3,
          background: color,
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}


// ─── Overview Tab ───────────────────────────────────────────────

function OverviewTab({ strengths, improvements, cvScores, contraindications }) {
  // Extract top-level scores for quick summary
  const wrinkleWhole = cvScores?.hd_wrinkle?.whole?.ui_score
  const poreWhole = cvScores?.hd_pore?.whole?.ui_score
  const acneScore = cvScores?.hd_acne?.whole?.ui_score
  const ageSpotScore = cvScores?.hd_age_spot?.ui_score

  return (
    <>
      {/* Quick CV Scores */}
      {(wrinkleWhole || poreWhole || acneScore || ageSpotScore) && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: theme.textMuted,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
          }}>
            Skin analysis scores
          </div>
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

      {/* Strengths & Improvements */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {strengths.length > 0 && (
          <div style={{
            flex: 1, background: `${theme.success}08`,
            borderRadius: 12, padding: 14,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: theme.success,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
            }}>
              Strengths
            </div>
            {strengths.map((s, i) => (
              <div key={i} style={{
                fontSize: 13, color: theme.text, marginBottom: 6,
                display: 'flex', gap: 6,
              }}>
                <span style={{ color: theme.success, flexShrink: 0 }}>✓</span> {s}
              </div>
            ))}
          </div>
        )}
        {improvements.length > 0 && (
          <div style={{
            flex: 1, background: `${theme.accent}08`,
            borderRadius: 12, padding: 14,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: theme.accent,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
            }}>
              Opportunities
            </div>
            {improvements.map((s, i) => (
              <div key={i} style={{
                fontSize: 13, color: theme.text, marginBottom: 6,
                display: 'flex', gap: 6,
              }}>
                <span style={{ color: theme.accent, flexShrink: 0 }}>→</span> {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contraindications */}
      {contraindications.length > 0 && (
        <div style={{
          background: `${theme.error}08`, borderRadius: 12, padding: 14,
          border: `1px solid ${theme.error}30`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: theme.error,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
          }}>
            Medical alerts
          </div>
          {contraindications.map((c, i) => (
            <div key={i} style={{
              fontSize: 13, color: theme.text, marginBottom: 8,
              paddingBottom: 8,
              borderBottom: i < contraindications.length - 1 ? `1px solid ${theme.error}15` : 'none',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                <span style={{
                  fontSize: 10, padding: '2px 6px', borderRadius: 4,
                  background: c.severity === 'ABSOLUTE' ? theme.error : theme.accent,
                  color: 'white', marginRight: 6,
                }}>
                  {c.severity}
                </span>
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
  const wrinkleZones = cvScores?.hd_wrinkle || {}
  const poreZones = cvScores?.hd_pore || {}
  const acne = cvScores?.hd_acne?.whole || cvScores?.hd_acne
  const ageSpot = cvScores?.hd_age_spot

  return (
    <>
      {/* Wrinkle zones */}
      {Object.keys(wrinkleZones).length > 0 && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14,
          }}>
            Wrinkle Analysis by Zone
          </div>
          {Object.entries(wrinkleZones)
            .filter(([zone]) => zone !== 'whole')
            .sort(([, a], [, b]) => (a.ui_score || 0) - (b.ui_score || 0))
            .map(([zone, data]) => (
              <ScoreBar
                key={zone}
                label={WRINKLE_ZONE_LABELS[zone] || zone}
                score={data.ui_score}
                compact
              />
            ))
          }
          {wrinkleZones.whole && (
            <div style={{
              marginTop: 8, paddingTop: 8,
              borderTop: `1px solid ${theme.border}`,
            }}>
              <ScoreBar
                label="Overall Wrinkle Score"
                score={wrinkleZones.whole.ui_score}
              />
            </div>
          )}
        </div>
      )}

      {/* Pore zones */}
      {Object.keys(poreZones).length > 0 && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14,
          }}>
            Pore Analysis by Zone
          </div>
          {Object.entries(poreZones)
            .filter(([zone]) => zone !== 'whole')
            .sort(([, a], [, b]) => (a.ui_score || 0) - (b.ui_score || 0))
            .map(([zone, data]) => (
              <ScoreBar
                key={zone}
                label={PORE_ZONE_LABELS[zone] || zone}
                score={data.ui_score}
                compact
              />
            ))
          }
          {poreZones.whole && (
            <div style={{
              marginTop: 8, paddingTop: 8,
              borderTop: `1px solid ${theme.border}`,
            }}>
              <ScoreBar
                label="Overall Pore Score"
                score={poreZones.whole.ui_score}
              />
            </div>
          )}
        </div>
      )}

      {/* Acne & Age Spots */}
      {(acne || ageSpot) && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14,
          }}>
            Other Skin Concerns
          </div>
          {acne?.ui_score != null && (
            <ScoreBar label="Acne" score={acne.ui_score} />
          )}
          {ageSpot?.ui_score != null && (
            <ScoreBar label="Age Spots" score={ageSpot.ui_score} />
          )}
        </div>
      )}
    </>
  )
}


// ─── Clinical Tab ───────────────────────────────────────────────

function ClinicalTab({ clinicalObs, treatmentRecs, glogau }) {
  return (
    <>
      {/* Glogau classification */}
      {glogau?.type && (
        <div style={{
          background: `${theme.primary}08`, borderRadius: 12, padding: 14,
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: theme.primary,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
          }}>
            Photoaging Classification
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
            Glogau Type {glogau.type}: {glogau.label}
          </div>
          {glogau.description && (
            <div style={{ fontSize: 13, color: theme.textLight }}>{glogau.description}</div>
          )}
        </div>
      )}

      {/* Clinical observations */}
      {clinicalObs.length > 0 && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12,
          }}>
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

      {/* Treatment considerations */}
      {treatmentRecs.length > 0 && (
        <div style={{
          background: theme.surface, borderRadius: 12, padding: 16,
          border: `1px solid ${theme.border}`, marginBottom: 16,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12,
          }}>
            Treatment Considerations
          </div>
          <div style={{
            fontSize: 11, color: theme.textMuted, marginBottom: 12,
            fontStyle: 'italic',
          }}>
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
                }}>
                  {rec.priority}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {rec.approaches?.map((approach, j) => (
                  <span key={j} style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 6,
                    background: `${theme.primary}10`,
                    color: theme.primary, fontWeight: 500,
                  }}>
                    {approach}
                  </span>
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
      background: c.bg, color: c.color,
      fontWeight: 700, textTransform: 'uppercase',
    }}>
      {severity || 'mild'}
    </span>
  )
}
