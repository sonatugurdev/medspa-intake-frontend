# MedSpa Intake — Patient Mobile Web App

Mobile-first React intake form for medspa patients. Opened via SMS link, no app download needed.

## Patient Flow

1. **Welcome** → Begin Intake
2. **Goals** → Select treatment interests (multi-select)
3. **Medical History** → Medications, allergies, toggles
4. **Photo Capture** → 3 guided photos (front, left 45°, right 45°)
5. **Review** → Confirm everything before submit
6. **Analyzing** → Progress animation while Claude API processes
7. **Score Reveal** → Health score, skin age, zone breakdown, insights
8. **Thank You** → Provider will review before appointment

## Setup

```bash
npm install
npm run dev
```

Opens at http://localhost:3000

## Project Structure

```
src/
├── App.jsx                   # Main app with step navigation
├── main.jsx                  # Entry point
├── components/
│   └── UI.jsx                # Shared components (Button, Toggle, Card, etc.)
├── hooks/
│   ├── useIntakeState.js     # Form state management
│   └── useCamera.js          # Camera capture hook
├── screens/
│   ├── WelcomeScreen.jsx     # Landing page
│   ├── GoalsScreen.jsx       # Treatment goal selection
│   ├── HistoryScreen.jsx     # Medical history form
│   ├── PhotoScreen.jsx       # 3-photo guided capture
│   ├── ReviewScreen.jsx      # Review before submit
│   ├── AnalyzingScreen.jsx   # Progress animation
│   ├── ScoreRevealScreen.jsx # Results display
│   └── ThankYouScreen.jsx    # Confirmation
├── styles/
│   └── global.css            # CSS variables, animations
└── utils/
    ├── constants.js          # Theme, goals, photo steps
    └── api.js                # Backend API calls
```

## Design System

- Primary: `#3B8B8A` (teal)
- Secondary: `#2D2A2E` (charcoal)
- Accent: `#D4930D` (amber)
- Background: `#FFF8F2` (warm cream)
- Font: DM Sans
- Border radius: 12px

## Backend Connection

Set the API URL in `.env`:

```
VITE_API_URL=http://localhost:8000
```

The app calls `POST /api/intake/submit` with the form data and photos.
Falls back to demo data if the backend isn't running.

## Testing on Mobile

Run `npm run dev` and open on your phone using your computer's local IP:

```
http://192.168.x.x:3000
```

Camera capture requires HTTPS in production. For local dev, localhost and local IP both work.
