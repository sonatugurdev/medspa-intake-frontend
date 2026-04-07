import { useState, useRef, useCallback, useEffect } from 'react'
import { theme } from '../utils/constants'

const RXNORM_URL = 'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search'

export default function MedicationAutocomplete({ onAdd, placeholder = 'Search medications...' }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const debounceRef = useRef(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  const searchRxNorm = useCallback(async (term) => {
    if (term.length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        terms: term,
        maxList: 8,
        ef: 'RXCUIS,STRENGTHS_AND_FORMS',
      })
      const response = await fetch(`${RXNORM_URL}?${params}`)
      const data = await response.json()

      // Response format: [totalCount, [names], {extra_fields}, [codes]]
      const names = data[1] || []
      const rxcuis = data[2]?.RXCUIS || []

      const results = names.map((name, i) => ({
        name: name,
        rxcui: rxcuis[i]?.[0] || null,
      }))

      setSuggestions(results)
      setShowDropdown(results.length > 0)
      setSelectedIdx(-1)
    } catch (err) {
      console.warn('RxNorm search failed:', err)
      setSuggestions([])
      setShowDropdown(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    // Debounce API calls at 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchRxNorm(value), 300)
  }

  const handleSelect = (suggestion) => {
    onAdd(suggestion.name, suggestion.rxcui)
    setQuery('')
    setSuggestions([])
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIdx >= 0 && suggestions[selectedIdx]) {
        handleSelect(suggestions[selectedIdx])
      } else if (query.trim()) {
        // Allow free text entry (non-RxNorm)
        onAdd(query.trim(), null)
        setQuery('')
        setSuggestions([])
        setShowDropdown(false)
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{
              width: '100%',
              padding: '14px 16px',
              paddingRight: loading ? 40 : 16,
              borderRadius: 10,
              border: `1.5px solid ${showDropdown ? theme.primary : theme.border}`,
              fontSize: 15,
              color: theme.text,
              background: theme.surface,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />
          {loading && (
            <div style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              width: 18, height: 18, border: `2px solid ${theme.border}`,
              borderTopColor: theme.primary, borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }} />
          )}
          <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 100,
            maxHeight: 280,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setSelectedIdx(i)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                background: i === selectedIdx ? `${theme.primary}10` : 'transparent',
                borderBottom: i < suggestions.length - 1 ? `1px solid ${theme.border}` : 'none',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>
                {s.name}
              </div>
              {s.rxcui && (
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                  RxCUI: {s.rxcui}
                </div>
              )}
            </div>
          ))}

          {/* Free text option */}
          {query.trim().length >= 2 && (
            <div
              onClick={() => {
                onAdd(query.trim(), null)
                setQuery('')
                setSuggestions([])
                setShowDropdown(false)
              }}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                background: theme.surfaceAlt,
                borderTop: `1px solid ${theme.border}`,
                fontSize: 13,
                color: theme.textLight,
              }}
            >
              Add "<strong>{query.trim()}</strong>" as entered
            </div>
          )}
        </div>
      )}
    </div>
  )
}
