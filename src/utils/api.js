const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function submitIntakeV2(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/intake/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Server error' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.warn('Backend not available, using demo data:', err.message)
    return getDemoResult()
  }
}

export async function fetchPracticeConfig(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/practice/${slug}`)
    if (!response.ok) return null
    return await response.json()
  } catch { return null }
}

function getDemoResult() {
  return {
    _demo: true,
    intake_id: 'demo-' + Date.now(),
    session_id: 'demo-session-' + Date.now(),
    status: 'complete',
    skin_analysis: {
      overall_skin_health: 76, skin_age: 32,
      fitzpatrick: { type: 3, label: 'Medium', confidence: 0.85 },
      glogau: { type: 2, label: 'Moderate', description: 'Early wrinkles in motion' },
      headline: 'Your skin shows a healthy foundation with early signs of aging that respond well to preventive treatments.',
      strengths: ['Even skin tone', 'Good hydration levels', 'Healthy skin barrier'],
      improvements: ['Early forehead expression lines', 'Mild pore visibility in T-zone'],
      cv_scores: {
        hd_wrinkle: { forehead: { ui_score: 72 }, glabellar: { ui_score: 78 }, crowfeet: { ui_score: 80 }, whole: { ui_score: 68 } },
        hd_pore: { forehead: { ui_score: 80 }, nose: { ui_score: 58 }, cheek: { ui_score: 68 }, whole: { ui_score: 70 } },
        hd_acne: { whole: { ui_score: 88 } },
        hd_age_spot: { ui_score: 82 },
      },
      mask_urls: {},
      clinical_observations: [
        { category: 'volume_loss', zone: 'midface', severity: 'mild', description: 'Subtle midface volume deflation', confidence: 0.7 },
      ],
      treatment_considerations: [
        { concern: 'Forehead expression lines', approaches: ['Botox', 'Dysport'], priority: 'medium' },
      ],
      contraindications: [],
    },
    processing_time_ms: 8500,
  }
}