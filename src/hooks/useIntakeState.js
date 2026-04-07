import { useState, useCallback } from 'react'

const INITIAL_HISTORY = {
  medications: [],
  allergies: [],
  pregnant: false,
  herpes: false,
  recentProcedure: false,
}

export function useIntakeState() {
  const [goals, setGoals] = useState([])
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [photo, setPhotoState] = useState(null) // single base64 data URL
  const [analysisResult, setAnalysisResult] = useState(null)

  const toggleGoal = useCallback((id) => {
    setGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }, [])

  const addMedication = useCallback((med) => {
    if (med.trim()) {
      setHistory(prev => ({
        ...prev,
        medications: [...prev.medications, med.trim()],
      }))
    }
  }, [])

  const removeMedication = useCallback((index) => {
    setHistory(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }, [])

  const addAllergy = useCallback((allergy) => {
    if (allergy.trim()) {
      setHistory(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy.trim()],
      }))
    }
  }, [])

  const removeAllergy = useCallback((index) => {
    setHistory(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }))
  }, [])

  const toggleHistoryField = useCallback((field) => {
    setHistory(prev => ({ ...prev, [field]: !prev[field] }))
  }, [])

  // Single photo setter — accepts a base64 data URL or null to clear
  const setPhoto = useCallback((dataUrl) => {
    setPhotoState(dataUrl)
  }, [])

  const reset = useCallback(() => {
    setGoals([])
    setHistory(INITIAL_HISTORY)
    setPhotoState(null)
    setAnalysisResult(null)
  }, [])

  return {
    goals,
    setGoals,
    toggleGoal,
    history,
    setHistory,
    addMedication,
    removeMedication,
    addAllergy,
    removeAllergy,
    toggleHistoryField,
    photo,
    setPhoto,
    analysisResult,
    setAnalysisResult,
    reset,
  }
}