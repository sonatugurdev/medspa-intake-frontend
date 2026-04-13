// ─── Theme (Glowa AI Design System) ────────────────────────────

export const theme = {
  teal: '#0F7B8C',
  tealDark: '#0A5A68',
  tealBg: '#E0F2F4',
  tealLight: '#B2E4EA',
  navy: '#1A1A2E',
  green: '#10B981',
  greenBg: '#ECFDF5',
  amber: '#F59E0B',
  amberBg: '#FFFBEB',
  red: '#EF4444',
  redBg: '#FEF2F2',
  s900: '#0F172A', s800: '#1E293B', s700: '#334155',
  s600: '#475569', s500: '#64748B', s400: '#94A3B8',
  s300: '#CBD5E1', s200: '#E2E8F0', s100: '#F1F5F9', s50: '#F8FAFC',
  white: '#FFFFFF',
  // Semantic aliases
  primary: '#0F7B8C', primaryDark: '#0A5A68', primaryLight: '#14B8A6',
  secondary: '#1A1A2E', surfaceAlt: '#F1F5F9',
  background: '#F8FAFC', surface: '#FFFFFF',
  text: '#0F172A', textLight: '#64748B', textMuted: '#94A3B8',
  border: '#E2E8F0', success: '#10B981', warning: '#F59E0B',
  error: '#EF4444', accent: '#F59E0B',
  radius: 14,
}

// ─── Concern Options ────────────────────────────────────────────

export const DEFAULT_CONCERNS = [
  { key: 'aging_fine_lines', label: 'Ageing & Fine Lines', sub: 'Botox, fillers, preventive' },
  { key: 'volume_contouring', label: 'Volume & Contouring', sub: 'Lips, cheeks, under-eye hollows, jawline' },
  { key: 'skin_texture', label: 'Skin Texture', sub: 'Microneedling, collagen stimulation' },
  { key: 'dark_spots_redness', label: 'Dark Spots & Redness', sub: 'Hyperpigmentation, redness, uneven tone' },
  { key: 'weight_loss', label: 'Weight Loss', sub: 'GLP-1 therapy' },
  { key: 'body_contouring', label: 'Body Contouring', sub: 'Fat reduction, skin laxity, cellulite, stretch marks' },
  { key: 'hair_thinning', label: 'Hair Thinning', sub: 'Hair restoration treatments' },
  { key: 'hair_removal', label: 'Hair Removal', sub: 'LHR, dermaplaning' },
  { key: 'vascular_veins', label: 'Vascular / Veins', sub: 'Spider or varicose veins' },
  { key: 'scar_revision', label: 'Scar Revision', sub: 'Surgical or injury-related' },
  { key: 'skin_tag_removal', label: 'Skin Tag Removal', sub: 'Safe, quick removal' },
  { key: 'excessive_sweating', label: 'Excessive Sweating', sub: 'Hyperhidrosis treatment' },
  { key: 'tattoo_removal', label: 'Tattoo Removal', sub: 'Laser removal' },
  { key: 'other', label: 'Other', sub: 'Event prep, confidence boost' },
]

// ─── Medical History Options ────────────────────────────────────

export const CONDITION_TOGGLES = [
  { key: 'autoimmune', label: 'Autoimmune or neuromuscular disorder', desc: 'e.g. lupus, MS, myasthenia gravis, rheumatoid arthritis' },
  { key: 'skin_cancer', label: 'History of skin cancer', desc: 'Melanoma, basal cell, squamous cell' },
  { key: 'cold_sores', label: 'Cold sores, eczema, or herpes', desc: 'Any history or current diagnosis' },
  { key: 'bruising_keloids', label: 'Issues with bruising, bleeding, or keloids', desc: 'Easy bruising, blood-clotting issues, or keloid scarring history' },
  { key: 'diabetes', label: 'Diabetes', desc: 'Type 1 or Type 2' },
  { key: 'heart_bp', label: 'Heart condition or high blood pressure', desc: '' },
]

export const MEDICATION_TOGGLES = [
  { key: 'blood_thinners', label: 'Currently on blood thinners', desc: 'Warfarin, aspirin, heparin, eliquis, or similar' },
  { key: 'accutane', label: 'Currently taking Accutane / isotretinoin', desc: 'Or within the last 6 months' },
  { key: 'dental_30d', label: 'Dental work or antibiotics in the last 30 days', desc: 'Including routine dental cleaning' },
  { key: 'vaccination_2w', label: 'Vaccination in the last 2 weeks', desc: 'Any vaccine including flu, COVID, shingles' },
  { key: 'previous_complications', label: 'Previous cosmetic treatment complications', desc: 'Adverse reactions, unexpected side effects, or infections' },
]

export const ALLERGY_TOGGLES = [
  { key: 'lidocaine', label: 'Lidocaine or local anaesthetics', desc: 'Used in numbing creams and injections' },
  { key: 'eggs', label: 'Eggs or egg-derived products', desc: 'Relevant to certain PRP and skincare formulations' },
  { key: 'latex', label: 'Latex', desc: '' },
  { key: 'skincare_ingredients', label: 'Specific skincare ingredients', desc: 'Retinol, AHA/BHA, fragrances, etc.' },
]

export const LIFESTYLE_CHIPS = [
  'Smoker', 'Regular alcohol', 'High sun exposure', 'Very active / athlete',
  'Poor sleep', 'High stress', 'Supplements', 'Plant-based diet',
]

export const TREATMENT_RECENCY_OPTIONS = [
  { value: 'never', label: 'Never had an aesthetic treatment' },
  { value: 'within_3m', label: 'Within the last 3 months' },
  { value: '3_12m', label: '3–12 months ago' },
  { value: 'over_1y', label: 'Over a year ago' },
]

export const SKIN_TYPES = [
  { value: 'oily', label: 'Oily', desc: 'Shine throughout the day, prone to breakouts' },
  { value: 'dry', label: 'Dry', desc: 'Feels tight, flaky, or rough' },
  { value: 'combination', label: 'Combination', desc: 'Oily T-zone, normal or dry elsewhere' },
  { value: 'normal', label: 'Normal', desc: 'Balanced, rarely irritated' },
  { value: 'sensitive', label: 'Sensitive', desc: 'Reacts easily to products or environment' },
  { value: 'not_sure', label: 'Not sure', desc: '' },
]

export const SPF_OPTIONS = [
  { value: 'daily', label: 'Yes, every morning' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'rarely', label: 'Rarely or never' },
]

export const PREVIOUS_TREATMENTS = [
  'Botox / Dysport', 'Dermal Fillers', 'Chemical Peel', 'Microneedling',
  'Laser / IPL', 'Hydrafacial', 'PRP', 'RF Treatment', 'None yet',
]

export const TIMELINE_OPTIONS = [
  { value: 'event', label: 'Specific event coming up', desc: 'Wedding, reunion, photoshoot, holiday — I have a date in mind' },
  { value: 'ongoing', label: 'Ongoing maintenance', desc: "I'm looking for a long-term skincare and treatment plan" },
  { value: 'exploring', label: 'Just exploring options', desc: "I'm curious about what's available and want to learn more" },
]

export const BUDGET_OPTIONS = [
  { value: 'under_300', label: 'Under $300', desc: 'Starter treatments, skincare products' },
  { value: '300_800', label: '$300 – $800', desc: 'Injectables, peels, facials' },
  { value: '800_2000', label: '$800 – $2,000', desc: 'Combination treatments, laser' },
  { value: '2000_plus', label: '$2,000+', desc: 'Comprehensive plans, advanced procedures' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say', desc: "We'll recommend based on your goals" },
]

export const STEP_CONFIG = [
  { key: 'personal_info', label: 'Personal Info', title: 'About you' },
  { key: 'concerns', label: 'Concerns', title: 'Your concerns' },
  { key: 'goals', label: 'Goals', title: 'Goals & timeline' },
  { key: 'medical_history', label: 'Medical History', title: 'Medical history' },
  { key: 'allergies_lifestyle', label: 'Allergies', title: 'Allergies & lifestyle' },
  { key: 'skin_profile', label: 'Skin History', title: 'Skin history' },
  { key: 'photos', label: 'Photos', title: 'Skin photos' },
  { key: 'consent', label: 'Consent', title: 'Consent' },
]

// Legacy compat
export const GOALS = DEFAULT_CONCERNS.map(c => ({
  id: c.key, label: c.label, icon: '✦', desc: c.sub,
}))

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'