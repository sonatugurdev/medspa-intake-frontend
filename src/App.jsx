import { useState, useCallback } from 'react'
import { theme } from './utils/constants'
import { submitIntake } from './utils/api'
import { useIntakeState } from './hooks/useIntakeState'
import { StepHeader, PrimaryButton, BottomBar } from './components/UI'
import WelcomeScreen from './screens/WelcomeScreen'
import GoalsScreen from './screens/GoalsScreen'
import HistoryScreen from './screens/HistoryScreen'
import PhotoScreen from './screens/PhotoScreen'
import ReviewScreen from './screens/ReviewScreen'
import AnalyzingScreen from './screens/AnalyzingScreen'
import ScoreRevealScreen from './screens/ScoreRevealScreen'
import ThankYouScreen from './screens/ThankYouScreen'

const TOTAL_STEPS = 4

export default function App() {
  const [step, setStep] = useState(-1) // -1 = welcome
  const [phase, setPhase] = useState('intake') // intake | analyzing | score | done
  const [submitError, setSubmitError] = useState(null)

  const intake = useIntakeState()

  const canProceed = () => {
    switch (step) {
      case 0: return intake.goals.length > 0
      case 1: return true
      case 2: return intake.photos.frontal && intake.photos.left && intake.photos.right
      case 3: return true
      default: return true
    }
  }

  const handleSubmit = useCallback(async () => {
    setPhase('analyzing')
    setSubmitError(null)

    // Minimum display time for analyzing screen (better UX)
    const minDisplayTime = new Promise(resolve => setTimeout(resolve, 4000))

    try {
      const [result] = await Promise.all([
        submitIntake({
          goals: intake.goals,
          history: intake.history,
          photos: intake.photos,
        }),
        minDisplayTime,
      ])
      intake.setAnalysisResult(result)

      if (result._demo) {
        setSubmitError('demo')
      }
    } catch (err) {
      console.error('Submit failed:', err)
      setSubmitError(err.message)
      intake.setAnalysisResult(null)
      await minDisplayTime
    }

    setPhase('score')
  }, [intake])

  const handleNext = () => {
    if (step === 3) {
      handleSubmit()
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  // ─── Render ────────────────────────────────────────────

  // Welcome screen
  if (step === -1) {
    return (
      <div style={containerStyle}>
        <WelcomeScreen onStart={() => setStep(0)} />
      </div>
    )
  }

  // Analyzing
  if (phase === 'analyzing') {
    return (
      <div style={containerStyle}>
        <AnalyzingScreen />
      </div>
    )
  }

  // Score reveal
  if (phase === 'score') {
    return (
      <div style={containerStyle}>
        <ScoreRevealScreen result={intake.analysisResult} frontalPhoto={intake.photos.frontal} />
        {submitError && (
          <div style={{
            position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
            background: `${theme.accent}15`, border: `1px solid ${theme.accent}40`,
            borderRadius: 8, padding: '8px 16px', fontSize: 12, color: theme.accent,
            maxWidth: 380, textAlign: 'center', zIndex: 20,
          }}>
            Using demo data — backend not connected
          </div>
        )}
        <BottomBar>
          <PrimaryButton label="Continue" onClick={() => setPhase('done')} />
        </BottomBar>
      </div>
    )
  }

  // Done
  if (phase === 'done') {
    return (
      <div style={containerStyle}>
        <ThankYouScreen />
      </div>
    )
  }

  // Intake steps
  const stepLabels = ['Continue', 'Continue', 'Continue', 'Submit for Analysis']

  return (
    <div style={containerStyle}>
      <StepHeader
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        canGoBack={step > 0}
      />

      <div style={{ padding: '24px 20px', paddingBottom: 120, minHeight: 'calc(100vh - 64px)' }}>
        {step === 0 && (
          <GoalsScreen goals={intake.goals} toggleGoal={intake.toggleGoal} />
        )}

        {step === 1 && (
          <HistoryScreen
            history={intake.history}
            addMedication={intake.addMedication}
            removeMedication={intake.removeMedication}
            addAllergy={intake.addAllergy}
            removeAllergy={intake.removeAllergy}
            toggleHistoryField={intake.toggleHistoryField}
          />
        )}

        {step === 2 && (
          <PhotoScreen
            photos={intake.photos}
            setPhoto={intake.setPhoto}
            clearPhoto={intake.clearPhoto}
          />
        )}

        {step === 3 && (
          <ReviewScreen
            goals={intake.goals}
            history={intake.history}
            photos={intake.photos}
          />
        )}
      </div>

      {/* Hide bottom bar on photo step — it has its own capture/retake/next buttons */}
      {step !== 2 && (
        <BottomBar>
          <PrimaryButton
            label={stepLabels[step]}
            onClick={handleNext}
            disabled={!canProceed()}
          />
        </BottomBar>
      )}
      {/* On photo step, show Continue only when all 3 photos are captured */}
      {step === 2 && intake.photos.frontal && intake.photos.left && intake.photos.right && (
        <BottomBar>
          <PrimaryButton label="Continue" onClick={handleNext} />
        </BottomBar>
      )}
    </div>
  )
}

const containerStyle = {
  maxWidth: 430,
  margin: '0 auto',
  position: 'relative',
  minHeight: '100vh',
  background: theme.bg,
}
