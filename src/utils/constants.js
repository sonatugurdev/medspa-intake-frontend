export const theme = {
  primary: '#3B8B8A',
  primaryLight: '#4CA8A7',
  primaryDark: '#2D6E6D',
  secondary: '#2D2A2E',
  accent: '#D4930D',
  accentLight: '#F5B642',
  bg: '#FFF8F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F0E8',
  text: '#2D2A2E',
  textLight: '#6B6770',
  textMuted: '#9B979E',
  success: '#2D8B5F',
  warning: '#D4930D',
  error: '#C94B4B',
  border: '#E8E0D8',
  radius: 12,
}

export const GOALS = [
  { id: 'wrinkles', label: 'Fine Lines & Wrinkles', icon: '✨', desc: 'Forehead, crow\'s feet, frown lines' },
  { id: 'texture', label: 'Skin Texture & Tone', icon: '🪞', desc: 'Smoothness, pore size, evenness' },
  { id: 'volume', label: 'Volume & Contouring', icon: '💎', desc: 'Cheeks, lips, jawline definition' },
  { id: 'pigment', label: 'Dark Spots & Pigmentation', icon: '🔆', desc: 'Sun damage, melasma, uneven tone' },
  { id: 'acne', label: 'Acne & Scarring', icon: '🩹', desc: 'Active breakouts, acne scars' },
  { id: 'hydration', label: 'Hydration & Glow', icon: '💧', desc: 'Dryness, dullness, radiance' },
  { id: 'preventive', label: 'Preventive Care', icon: '🛡️', desc: 'Anti-aging maintenance, skin health' },
  { id: 'other', label: 'Other Concerns', icon: '💬', desc: "I'll discuss with my provider" },
]

export const PHOTO_STEPS = [
  { id: 'frontal', label: 'Front View', instruction: 'Look directly at the camera', icon: '😐' },
  { id: 'left', label: 'Left Side', instruction: 'Turn your head slightly to the right', icon: '😏' },
  { id: 'right', label: 'Right Side', instruction: 'Turn your head slightly to the left', icon: '😏' },
]

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
