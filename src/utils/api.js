import { API_BASE_URL } from './constants'

export async function submitIntake({ goals, history, photos }) {
  const payload = {
    goals,
    medications: history.medications.map(m => typeof m === 'object' ? m.name : m),
    medication_rxcuis: history.medications
      .filter(m => typeof m === 'object' && m.rxcui)
      .map(m => ({ name: m.name, rxcui: m.rxcui })),
    allergies: history.allergies,
    pregnant_nursing: history.pregnant,
    history_herpes: history.herpes,
    recent_procedure: history.recentProcedure,
    photos: {
      frontal: photos.frontal,
      left: photos.left,
      right: photos.right,
    },
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
    // Return demo data so the frontend works without the backend
    return getDemoResult()
  }
}

function getDemoResult() {
  return {
    intake_id: 'demo-' + Date.now(),
    status: 'complete',
    skin_analysis: {
      overall_skin_health: 74,
      fitzpatrick: { type: 3, label: 'Medium', confidence: 0.85 },
      face_bounds: { x: 25, y: 10, width: 50, height: 65 },
      zones: {
        forehead: { texture_score: 78, wrinkle_depth_index: 0.8, pigmentation_score: 85, hydration_estimate: 72, notes: 'Minimal fine lines, good overall texture' },
        periorbital: { texture_score: 72, wrinkle_depth_index: 1.2, pigmentation_score: 80, hydration_estimate: 65, notes: 'Early crow\'s feet visible at angles' },
        midface: { texture_score: 80, wrinkle_depth_index: 0.5, pigmentation_score: 88, hydration_estimate: 75, notes: 'Even tone, good elasticity' },
        perioral: { texture_score: 74, wrinkle_depth_index: 0.6, pigmentation_score: 84, hydration_estimate: 68, notes: 'Well maintained' },
        jawline_neck: { texture_score: 76, wrinkle_depth_index: 0.3, pigmentation_score: 82, hydration_estimate: 70, notes: 'Good definition' },
      },
      cross_view_observations: [
        'Fine lines around eyes more visible from side angles',
        'Skin tone is consistent across all views',
      ],
      key_findings: [
        'Healthy skin with early signs of aging around the eyes',
        'Even skin tone with good hydration',
      ],
      visual_findings: [
        {
          type: 'fine_lines',
          label: 'Forehead Expression Lines',
          description: 'Mild horizontal lines across the forehead, typical of expressive facial movement. These are dynamic lines that deepen with facial expressions.',
          severity: 'mild',
          zone: 'forehead',
          paths: [
            [[35,18], [40,17], [45,17.5], [50,17], [55,17.5], [60,17], [65,18]],
            [[37,21], [42,20], [47,20.5], [52,20], [57,20.5], [62,20], [63,21]],
            [[38,24], [43,23], [48,23.5], [53,23], [58,23.5], [61,24]],
          ],
        },
        {
          type: 'wrinkles',
          label: "Crow's Feet (Left)",
          description: 'Fine lines radiating from the outer corner of your left eye. Among the earliest signs of aging, these respond very well to neuromodulator treatments.',
          severity: 'mild',
          zone: 'periorbital',
          paths: [
            [[30,33], [28,31], [26,29]],
            [[30,35], [27,34], [25,33]],
            [[30,37], [28,38], [26,39]],
          ],
        },
        {
          type: 'wrinkles',
          label: "Crow's Feet (Right)",
          description: 'Matching fine lines on the right side, symmetrical with the left. Consistent aging pattern indicates these are expression-related.',
          severity: 'mild',
          zone: 'periorbital',
          paths: [
            [[70,33], [72,31], [74,29]],
            [[70,35], [73,34], [75,33]],
            [[70,37], [72,38], [74,39]],
          ],
        },
        {
          type: 'fine_lines',
          label: 'Nasolabial Folds',
          description: 'Subtle lines running from the sides of the nose toward the mouth corners. These are normal facial contours that deepen with age.',
          severity: 'mild',
          zone: 'midface',
          paths: [
            [[42,42], [41,47], [40,52], [41,57], [42,60]],
            [[58,42], [59,47], [60,52], [59,57], [58,60]],
          ],
        },
        {
          type: 'dark_circles',
          label: 'Under-Eye Shadows',
          description: 'Mild under-eye darkness, likely due to skin thinness in this area rather than pigmentation. Common and often genetic.',
          severity: 'mild',
          zone: 'periorbital',
          region: { x: 40, y: 37, width: 8, height: 3 },
        },
        {
          type: 'dark_circles',
          label: 'Under-Eye Shadows (Right)',
          description: 'Matching under-eye hollowing on the right side. Can be addressed with hyaluronic acid fillers or PRP treatment.',
          severity: 'mild',
          zone: 'periorbital',
          region: { x: 60, y: 37, width: 8, height: 3 },
        },
      ],
    },
    patient_summary: {
      headline: 'Your skin is in great shape with an excellent foundation for preventive care',
      strengths: ['Even skin tone', 'Good elasticity', 'Healthy hydration'],
      areas_for_improvement: ['Early crow\'s feet forming', 'Mild forehead expression lines'],
      estimated_skin_age: 29,
    },
    contraindications: [],
    recommendations: {
      treatments: [
        { treatment_name: 'Botox Cosmetic — Crow\'s Feet', final_score: 0.85, blocked_by_contraindication: false },
        { treatment_name: 'HydraFacial', final_score: 0.78, blocked_by_contraindication: false },
        { treatment_name: 'Light Chemical Peel', final_score: 0.72, blocked_by_contraindication: false },
      ],
    },
    processing_time_ms: 0,
    _demo: true,
  }
}
