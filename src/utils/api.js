const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function submitIntake({ goals, history, photo }) {
  const payload = {
    goals,
    medications: history.medications,
    allergies: history.allergies,
    pregnant_nursing: history.pregnant,
    history_herpes: history.herpes,
    recent_procedure: history.recentProcedure,
    photo, // single base64 data URL
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/intake/submit`, {
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

function getDemoResult() {
  return {
    _demo: true,
    intake_id: 'demo-' + Date.now(),
    status: 'complete',
    skin_analysis: {
      overall_skin_health: 76,
      skin_age: 32,
      fitzpatrick: { type: 3, label: 'Medium', confidence: 0.85 },
      glogau: { type: 2, label: 'Moderate', description: 'Early wrinkles in motion' },
      headline: 'Your skin shows a healthy foundation with early signs of aging that respond well to preventive treatments.',
      strengths: ['Even skin tone', 'Good hydration levels', 'Healthy skin barrier'],
      improvements: ['Early forehead expression lines', 'Mild pore visibility in T-zone'],
      cv_scores: {
        hd_wrinkle: {
          forehead: { ui_score: 72, raw_score: 60.5 },
          glabellar: { ui_score: 78, raw_score: 70.2 },
          crowfeet: { ui_score: 80, raw_score: 75.1 },
          periocular: { ui_score: 74, raw_score: 65.3 },
          nasolabial: { ui_score: 76, raw_score: 68.0 },
          marionette: { ui_score: 82, raw_score: 78.4 },
          whole: { ui_score: 68, raw_score: 52.8 },
        },
        hd_pore: {
          forehead: { ui_score: 80, raw_score: 74.2 },
          nose: { ui_score: 58, raw_score: 32.5 },
          cheek: { ui_score: 68, raw_score: 48.3 },
          whole: { ui_score: 70, raw_score: 52.1 },
        },
        hd_acne: {
          whole: { ui_score: 88, raw_score: 82.0 },
        },
        hd_age_spot: {
          ui_score: 82, raw_score: 76.5,
        },
      },
      mask_urls: {},
      clinical_observations: [
        { category: 'volume_loss', zone: 'midface', severity: 'mild', description: 'Subtle midface volume deflation', confidence: 0.7 },
        { category: 'skin_laxity', zone: 'jawline', severity: 'none', description: 'Good jawline definition maintained', confidence: 0.85 },
      ],
      treatment_considerations: [
        { concern: 'Forehead expression lines', approaches: ['Botox', 'Dysport'], priority: 'medium' },
        { concern: 'Pore refinement', approaches: ['HydraFacial', 'Chemical Peel'], priority: 'low' },
      ],
      contraindications: [],
    },
    processing_time_ms: 8500,
  }
}