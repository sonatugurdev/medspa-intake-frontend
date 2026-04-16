import { useState, useCallback, useRef, useEffect } from 'react'
import { STEP_CONFIG } from './utils/constants'
import { submitIntakeV2 } from './utils/api'
import { useIntakeState } from './hooks/useIntakeState'
import { usePractice } from './contexts/PracticeContext'
import { StepHeader, PrimaryButton, BottomBar, SkipLink } from './components/UI'

import WelcomeScreen from './screens/WelcomeScreen'
import PersonalInfoScreen from './screens/PersonalInfoScreen'
import ConcernsScreen from './screens/ConcernsScreen'
import GoalsScreen from './screens/GoalsScreen'
import MedicalHistoryScreen from './screens/MedicalHistoryScreen'
import AllergiesLifestyleScreen from './screens/AllergiesLifestyleScreen'
import SkinProfileScreen from './screens/SkinProfileScreen'
import PhotoScreen from './screens/PhotoScreen'
import ConsentScreen from './screens/ConsentScreen'
import AnalyzingScreen from './screens/AnalyzingScreen'
import ScoreRevealScreen from './screens/ScoreRevealScreen'
import ThankYouScreen from './screens/ThankYouScreen'

const TOTAL_STEPS = 8

export default function App() {
  const [step, setStep] = useState(-1) // -1 = welcome
  const [phase, setPhase] = useState('intake') // intake | analyzing | score | done
  const [submitError, setSubmitError] = useState(null)

  const scrollRef = useRef(null)

  // Scroll to top when step changes
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [step])

  const practice = usePractice()
  const { theme, slug, practiceName, logoUrl, loading: practiceLoading, showPoweredBy } = practice

  const intake = useIntakeState()

  const canProceed = () => {
    switch (step) {
      case 0: return intake.personalInfo.firstName && intake.personalInfo.lastName && intake.personalInfo.email && intake.personalInfo.dob
      case 1: return intake.concerns.length > 0
      case 2: return true // goals are optional
      case 3: return true
      case 4: return true
      case 5: return true
      case 6: return !!intake.photoFront
      case 7: return intake.consent.photoConsent && intake.consent.hipaaConsent && intake.consent.sideEffectsConsent
      default: return true
    }
  }

  const handleSubmit = useCallback(async () => {
    setPhase('analyzing')
    setSubmitError(null)

    const minDisplayTime = new Promise(resolve => setTimeout(resolve, 4000))
    const payload = intake.buildPayload(slug)

    try {
      const [result] = await Promise.all([submitIntakeV2(payload), minDisplayTime])
      intake.setAnalysisResult(result)
      if (result._demo) setSubmitError('demo')
    } catch (err) {
      console.error('Submit failed:', err)
      setSubmitError(err.message)
      intake.setAnalysisResult(null)
      await minDisplayTime
    }

    setPhase('score')
  }, [intake, slug])

  const handleNext = () => {
    if (step === TOTAL_STEPS - 1) {
      handleSubmit()
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const containerStyle = {
    maxWidth: 430,
    margin: '0 auto',
    position: 'relative',
    minHeight: '100vh',
    background: theme.s50,
    display: 'flex',
    flexDirection: 'column',
  }

  // ─── Loading State ──────────────────────────────────────────
  if (practiceLoading) {
    return (
      <div style={containerStyle}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', gap: 16,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: `3px solid ${theme.s200}`, borderTopColor: theme.teal,
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 14, color: theme.s400 }}>Loading...</span>
        </div>
      </div>
    )
  }

  // ─── Welcome ──────────────────────────────────────────────
  if (step === -1) {
    return (
      <div style={containerStyle}>
        <WelcomeScreen
          onStart={() => setStep(0)}
          practiceName={practiceName}
          logoUrl={logoUrl}
          theme={theme}
        />
        <PoweredByFooter theme={theme} show={showPoweredBy} />
      </div>
    )
  }

  // ─── Analyzing ────────────────────────────────────────────
  if (phase === 'analyzing') {
    return <div style={containerStyle}><AnalyzingScreen theme={theme} /></div>
  }

  // ─── Score Reveal ─────────────────────────────────────────
  if (phase === 'score') {
    return (
      <div style={containerStyle}>
        <ScoreRevealScreen result={intake.analysisResult} frontalPhoto={intake.photoFront} />
        {submitError && (
          <div style={{
            position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
            background: `${theme.amberBg}`, border: `1px solid ${theme.amber}40`,
            borderRadius: 8, padding: '8px 16px', fontSize: 12, color: theme.amber,
            maxWidth: 380, textAlign: 'center', zIndex: 20,
          }}>
            {submitError === 'demo' ? 'Using demo data — backend not connected' : `Error: ${submitError}`}
          </div>
        )}
        <BottomBar theme={theme}>
          <PrimaryButton label="Continue" onClick={() => setPhase('done')} theme={theme}
            style={{ padding: '12px 16px', fontSize: 14, borderRadius: 10 }} />
        </BottomBar>
        <PoweredByFooter theme={theme} show={showPoweredBy} />
      </div>
    )
  }

  // ─── Done ─────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div style={containerStyle}>
        <ThankYouScreen practiceName={practiceName} theme={theme} />
        <PoweredByFooter theme={theme} show={showPoweredBy} />
      </div>
    )
  }

  // ─── Intake Steps ─────────────────────────────────────────
  const buttonLabels = ['Continue →', 'Continue →', 'Continue →', 'Continue →', 'Continue →', 'Continue →', 'Continue →', 'Submit intake ✓']

  return (
    <div style={containerStyle}>
      <StepHeader step={step} totalSteps={TOTAL_STEPS} onBack={handleBack} canGoBack={step > 0} theme={theme} />

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '20px 24px', paddingBottom: 120 }}>
          {step === 0 && (
            <PersonalInfoScreen personalInfo={intake.personalInfo} updatePersonalInfo={intake.updatePersonalInfo} />
          )}
          {step === 1 && (
            <ConcernsScreen concerns={intake.concerns} toggleConcern={intake.toggleConcern}
              concernsFreeText={intake.concernsFreeText} setConcernsFreeText={intake.setConcernsFreeText} />
          )}
          {step === 2 && (
            <GoalsScreen goals={intake.goals} updateGoals={intake.updateGoals} />
          )}
          {step === 3 && (
            <MedicalHistoryScreen medicalHistory={intake.medicalHistory}
              toggleCondition={intake.toggleCondition} toggleMedicationFlag={intake.toggleMedicationFlag}
              updateMedicalHistory={intake.updateMedicalHistory} />
          )}
          {step === 4 && (
            <AllergiesLifestyleScreen allergiesLifestyle={intake.allergiesLifestyle}
              toggleAllergy={intake.toggleAllergy} toggleLifestyleFactor={intake.toggleLifestyleFactor}
              updateAllergiesLifestyle={intake.updateAllergiesLifestyle} />
          )}
          {step === 5 && (
            <SkinProfileScreen skinProfile={intake.skinProfile}
              updateSkinProfile={intake.updateSkinProfile}
              togglePreviousTreatment={intake.togglePreviousTreatment} />
          )}
          {step === 6 && (
            <PhotoScreen
              photo={intake.photoFront} setPhoto={intake.setPhotoFront}
              photoLeft={intake.photoLeft} setPhotoLeft={intake.setPhotoLeft}
              photoRight={intake.photoRight} setPhotoRight={intake.setPhotoRight}
            />
          )}
          {step === 7 && (
            <ConsentScreen consent={intake.consent}
              toggleConsent={intake.toggleConsent} updateConsent={intake.updateConsent} />
          )}
        </div>
      </div>

      <BottomBar theme={theme}>
        <PrimaryButton label={buttonLabels[step]} onClick={handleNext} disabled={!canProceed()} theme={theme} />
        {step === 6 && <SkipLink onClick={handleNext} theme={theme} />}
      </BottomBar>

      <PoweredByFooter theme={theme} show={showPoweredBy} />
    </div>
  )
}

function PoweredByFooter({ theme, show }) {
  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 4, left: '50%', transform: 'translateX(-50%)',
      fontSize: 9, color: theme.s300, zIndex: 5,
    }}>
      Powered by <span style={{ fontWeight: 700, color: theme.teal }}>Glowa</span>
      <span style={{ fontWeight: 700, color: theme.navy }}>AI</span>
    </div>
  )
}
