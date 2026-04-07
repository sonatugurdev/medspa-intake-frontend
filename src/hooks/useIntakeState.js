import { useState, useCallback } from 'react'

const INITIAL_HISTORY = {
  medications: [],
  allergies: [],
  pregnant: false,
  herpes: false,
  recentProcedure: false,
}

const INITIAL_PHOTOS = {
  frontal: null,
  left: null,
  right: null,
}

export function useIntakeState() {
  const [goals, setGoals] = useState([])
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [photos, setPhotos] = useState(INITIAL_PHOTOS)
  const [analysisResult, setAnalysisResult] = useState(null)

  const toggleGoal = useCallback((id) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }, [])

  const addMedication = useCallback((med, rxcui = null) => {
    const name = typeof med === 'string' ? med.trim() : med
    if (name) {
      setHistory(prev => ({
        ...prev,
        medications: [...prev.medications, { name, rxcui }],
      }))
    }
  }, [])

  const removeMedication = useCallback((index) => {
    setHistory(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }))
  }, [])

  const addAllergy = useCallback((allergy) => {
    if (allergy.trim()) {
      setHistory(prev => ({ ...prev, allergies: [...prev.allergies, allergy.trim()] }))
    }
  }, [])

  const removeAllergy = useCallback((index) => {
    setHistory(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== index) }))
  }, [])

  const toggleHistoryField = useCallback((field) => {
    setHistory(prev => ({ ...prev, [field]: !prev[field] }))
  }, [])

  const setPhoto = useCallback((key, dataUrl) => {
    setPhotos(prev => ({ ...prev, [key]: dataUrl }))
  }, [])

  const clearPhoto = useCallback((key) => {
    setPhotos(prev => ({ ...prev, [key]: null }))
  }, [])

  const reset = useCallback(() => {
    setGoals([])
    setHistory(INITIAL_HISTORY)
    setPhotos(INITIAL_PHOTOS)
    setAnalysisResult(null)
  }, [])

  return {
    goals, setGoals, toggleGoal,
    history, setHistory, addMedication, removeMedication, addAllergy, removeAllergy, toggleHistoryField,
    photos, setPhoto, clearPhoto,
    analysisResult, setAnalysisResult,
    reset,
  }
}
