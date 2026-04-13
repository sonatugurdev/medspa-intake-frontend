import { useState, useCallback } from 'react'

const INITIAL_PERSONAL_INFO = {
  firstName: '', lastName: '', dob: '', email: '', phone: '', pronouns: '', referralSource: '',
}

const INITIAL_GOALS = {
  biggestConcern: '', goalsText: '', timelineType: '', eventDate: '', budgetRange: '',
}

const INITIAL_MEDICAL_HISTORY = {
  conditions: {}, medicationFlags: {}, pregnantNursing: false, medicationsText: '', previousComplications: false,
}

const INITIAL_ALLERGIES_LIFESTYLE = {
  knownAllergies: {}, otherAllergies: '', lifestyleFactors: [], lastTreatmentRecency: '',
}

const INITIAL_SKIN_PROFILE = {
  skinType: '', spfUsage: '', skincareRoutine: '', previousTreatments: [],
}

const INITIAL_CONSENT = {
  photoConsent: false, hipaaConsent: false, sideEffectsConsent: false,
  commsConsent: false, marketingConsent: false, typedName: '', signatureData: null,
}

export function useIntakeState() {
  const [personalInfo, setPersonalInfo] = useState(INITIAL_PERSONAL_INFO)
  const [concerns, setConcerns] = useState([])
  const [concernsFreeText, setConcernsFreeText] = useState('')
  const [goals, setGoals] = useState(INITIAL_GOALS)
  const [medicalHistory, setMedicalHistory] = useState(INITIAL_MEDICAL_HISTORY)
  const [allergiesLifestyle, setAllergiesLifestyle] = useState(INITIAL_ALLERGIES_LIFESTYLE)
  const [skinProfile, setSkinProfile] = useState(INITIAL_SKIN_PROFILE)
  const [photoFront, setPhotoFront] = useState(null)
  const [photoLeft, setPhotoLeft] = useState(null)
  const [photoRight, setPhotoRight] = useState(null)
  const [consent, setConsent] = useState(INITIAL_CONSENT)
  const [analysisResult, setAnalysisResult] = useState(null)

  const updatePersonalInfo = useCallback((field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
  }, [])

  const toggleConcern = useCallback((key, label) => {
    setConcerns(prev =>
      prev.find(c => c.key === key)
        ? prev.filter(c => c.key !== key)
        : [...prev, { key, label }]
    )
  }, [])

  const updateGoals = useCallback((field, value) => {
    setGoals(prev => ({ ...prev, [field]: value }))
  }, [])

  const toggleCondition = useCallback((key) => {
    setMedicalHistory(prev => ({
      ...prev, conditions: { ...prev.conditions, [key]: !prev.conditions[key] },
    }))
  }, [])

  const toggleMedicationFlag = useCallback((key) => {
    setMedicalHistory(prev => ({
      ...prev, medicationFlags: { ...prev.medicationFlags, [key]: !prev.medicationFlags[key] },
    }))
  }, [])

  const updateMedicalHistory = useCallback((field, value) => {
    setMedicalHistory(prev => ({ ...prev, [field]: value }))
  }, [])

  const toggleAllergy = useCallback((key) => {
    setAllergiesLifestyle(prev => ({
      ...prev, knownAllergies: { ...prev.knownAllergies, [key]: !prev.knownAllergies[key] },
    }))
  }, [])

  const toggleLifestyleFactor = useCallback((factor) => {
    setAllergiesLifestyle(prev => ({
      ...prev,
      lifestyleFactors: prev.lifestyleFactors.includes(factor)
        ? prev.lifestyleFactors.filter(f => f !== factor)
        : [...prev.lifestyleFactors, factor],
    }))
  }, [])

  const updateAllergiesLifestyle = useCallback((field, value) => {
    setAllergiesLifestyle(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateSkinProfile = useCallback((field, value) => {
    setSkinProfile(prev => ({ ...prev, [field]: value }))
  }, [])

  const togglePreviousTreatment = useCallback((treatment) => {
    setSkinProfile(prev => ({
      ...prev,
      previousTreatments: prev.previousTreatments.includes(treatment)
        ? prev.previousTreatments.filter(t => t !== treatment)
        : [...prev.previousTreatments, treatment],
    }))
  }, [])

  const toggleConsent = useCallback((field) => {
    setConsent(prev => ({ ...prev, [field]: !prev[field] }))
  }, [])

  const updateConsent = useCallback((field, value) => {
    setConsent(prev => ({ ...prev, [field]: value }))
  }, [])

  const buildPayload = useCallback((practiceSlug = 'demo-clinic') => ({
    practice_slug: practiceSlug,
    personal_info: {
      first_name: personalInfo.firstName, last_name: personalInfo.lastName,
      dob: personalInfo.dob, email: personalInfo.email,
      phone: personalInfo.phone || null, pronouns: personalInfo.pronouns || null,
      referral_source: personalInfo.referralSource || null,
    },
    concerns: concerns.map(c => ({ key: c.key, label: c.label })),
    concerns_free_text: concernsFreeText || null,
    goals: {
      biggest_concern: goals.biggestConcern || null, goals_text: goals.goalsText || null,
      timeline_type: goals.timelineType || null, event_date: goals.eventDate || null,
      budget_range: goals.budgetRange || null,
    },
    medical_history: {
      conditions: medicalHistory.conditions, medication_flags: medicalHistory.medicationFlags,
      pregnant_nursing: medicalHistory.pregnantNursing,
      medications_text: medicalHistory.medicationsText || null,
      previous_complications: medicalHistory.previousComplications,
    },
    allergies_lifestyle: {
      known_allergies: allergiesLifestyle.knownAllergies,
      other_allergies: allergiesLifestyle.otherAllergies || null,
      lifestyle_factors: allergiesLifestyle.lifestyleFactors,
      last_treatment_recency: allergiesLifestyle.lastTreatmentRecency || null,
    },
    skin_profile: {
      skin_type: skinProfile.skinType || null, spf_usage: skinProfile.spfUsage || null,
      skincare_routine: skinProfile.skincareRoutine || null,
      previous_treatments: skinProfile.previousTreatments,
    },
    photo_front: photoFront, photo_left: photoLeft || null, photo_right: photoRight || null,
    consent: {
      photo_consent: consent.photoConsent, hipaa_consent: consent.hipaaConsent,
      side_effects_consent: consent.sideEffectsConsent, comms_consent: consent.commsConsent,
      marketing_consent: consent.marketingConsent, typed_name: consent.typedName || null,
      signature_data: consent.signatureData || null,
    },
  }), [personalInfo, concerns, concernsFreeText, goals, medicalHistory, allergiesLifestyle, skinProfile, photoFront, photoLeft, photoRight, consent])

  return {
    personalInfo, concerns, concernsFreeText, goals, medicalHistory,
    allergiesLifestyle, skinProfile, photoFront, photoLeft, photoRight,
    consent, analysisResult,
    updatePersonalInfo, toggleConcern, setConcernsFreeText,
    updateGoals, toggleCondition, toggleMedicationFlag, updateMedicalHistory,
    toggleAllergy, toggleLifestyleFactor, updateAllergiesLifestyle,
    updateSkinProfile, togglePreviousTreatment,
    setPhotoFront, setPhotoLeft, setPhotoRight,
    toggleConsent, updateConsent, setAnalysisResult,
    buildPayload,
  }
}