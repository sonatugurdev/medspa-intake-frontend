import { GOALS } from '../utils/constants'
import { SelectableCard } from '../components/UI'

export default function GoalsScreen({ goals, toggleGoal }) {
  return (
    <div className="slide-in">
      <h2 style={{ fontSize: 26, fontWeight: 700, color: '#2D2A2E', marginBottom: 8, letterSpacing: '-0.5px' }}>
        What brings you in?
      </h2>
      <p style={{ fontSize: 15, color: '#6B6770', marginBottom: 28, lineHeight: 1.5 }}>
        Select all that apply — this helps us personalize your consultation.
      </p>

      {GOALS.map(goal => (
        <SelectableCard
          key={goal.id}
          selected={goals.includes(goal.id)}
          icon={goal.icon}
          title={goal.label}
          description={goal.desc}
          onClick={() => toggleGoal(goal.id)}
        />
      ))}
    </div>
  )
}
