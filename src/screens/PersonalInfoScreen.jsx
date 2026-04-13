import { theme } from '../utils/constants'

export default function PersonalInfoScreen({ personalInfo, updatePersonalInfo }) {
  const field = (label, key, type = 'text', placeholder = '', required = false) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
        {label} {required && <span style={{ color: theme.red, marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={personalInfo[key]}
        onChange={e => updatePersonalInfo(key, e.target.value)}
        style={{
          width: '100%', padding: '13px 14px', border: `1.5px solid ${theme.s200}`,
          borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white,
        }}
      />
    </div>
  )

  return (
    <div className="slide-in">
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.s900, marginBottom: 6 }}>
        Let's get to know you
      </div>
      <div style={{ fontSize: 14, color: theme.s500, marginBottom: 24, lineHeight: 1.5 }}>
        A few quick details before your consultation.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {field('First Name', 'firstName', 'text', 'Sarah', true)}
        {field('Last Name', 'lastName', 'text', 'Chen', true)}
      </div>
      {field('Date of Birth', 'dob', 'date', '', true)}
      {field('Email Address', 'email', 'email', 'sarah@email.com', true)}
      {field('Phone Number', 'phone', 'tel', '(310) 555-0192')}

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          Pronouns <span style={{ fontWeight: 400, color: theme.s400 }}>(optional)</span>
        </label>
        <select
          value={personalInfo.pronouns}
          onChange={e => updatePersonalInfo('pronouns', e.target.value)}
          style={{
            width: '100%', padding: '13px 14px', border: `1.5px solid ${theme.s200}`,
            borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white, appearance: 'none',
          }}
        >
          <option value="">Prefer not to say</option>
          <option value="she_her">She / Her</option>
          <option value="he_him">He / Him</option>
          <option value="they_them">They / Them</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: theme.s700, marginBottom: 6, display: 'block' }}>
          How did you hear about us?
        </label>
        <select
          value={personalInfo.referralSource}
          onChange={e => updatePersonalInfo('referralSource', e.target.value)}
          style={{
            width: '100%', padding: '13px 14px', border: `1.5px solid ${theme.s200}`,
            borderRadius: 10, fontSize: 14, color: theme.s900, background: theme.white, appearance: 'none',
          }}
        >
          <option value="">Select one…</option>
          <option value="social_media">Instagram / Social Media</option>
          <option value="google">Google Search</option>
          <option value="friend_family">Friend or Family</option>
          <option value="returning">Returning Patient</option>
          <option value="doctor_referral">Doctor Referral</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  )
}
