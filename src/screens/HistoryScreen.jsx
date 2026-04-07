import { useState } from 'react'
import { theme } from '../utils/constants'
import { PrimaryButton, Toggle, Tag } from '../components/UI'
import MedicationAutocomplete from '../components/MedicationAutocomplete'

export default function HistoryScreen({
  history, addMedication, removeMedication,
  addAllergy, removeAllergy, toggleHistoryField,
}) {
  const [allergyInput, setAllergyInput] = useState('')

  const handleAddMed = (name, rxcui) => {
    addMedication(name, rxcui)
  }

  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      addAllergy(allergyInput)
      setAllergyInput('')
    }
  }

  return (
    <div className="slide-in">
      <h2 style={{ fontSize: 26, fontWeight: 700, color: theme.secondary, marginBottom: 8 }}>
        Medical History
      </h2>
      <p style={{ fontSize: 15, color: theme.textLight, marginBottom: 28, lineHeight: 1.5 }}>
        This helps us recommend safe treatments.
      </p>

      {/* Medications with RxNorm Autocomplete */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: theme.secondary, marginBottom: 8, display: 'block' }}>
          Current Medications
        </label>
        <MedicationAutocomplete
          onAdd={handleAddMed}
          placeholder="Search medications (e.g. Tretinoin, Accutane)..."
        />
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
          {history.medications.map((m, i) => (
            <Tag
              key={i}
              text={typeof m === 'object' ? m.name : m}
              onRemove={() => removeMedication(i)}
            />
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: theme.secondary, marginBottom: 8, display: 'block' }}>
          Known Allergies
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 10,
              border: `1.5px solid ${theme.border}`, fontSize: 15,
              color: theme.text, background: theme.surface, outline: 'none',
              boxSizing: 'border-box', flex: 1,
            }}
            placeholder="e.g. Lidocaine, Latex..."
            value={allergyInput}
            onChange={e => setAllergyInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddAllergy()}
          />
          <PrimaryButton label="+" onClick={handleAddAllergy} style={{ width: 48, padding: '0 16px', fontSize: 20 }} />
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
          {history.allergies.map((a, i) => (
            <Tag key={i} text={a} onRemove={() => removeAllergy(i)} />
          ))}
        </div>
      </div>

      {/* Toggles */}
      <Toggle label="Are you pregnant or nursing?" active={history.pregnant} onToggle={() => toggleHistoryField('pregnant')} />
      <Toggle label="History of cold sores (HSV)?" active={history.herpes} onToggle={() => toggleHistoryField('herpes')} />
      <Toggle label="Had any skin procedures in the past 2 weeks?" active={history.recentProcedure} onToggle={() => toggleHistoryField('recentProcedure')} />
    </div>
  )
}
