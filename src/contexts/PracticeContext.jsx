import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { fetchPracticeConfig } from '../utils/api'
import { theme as defaultTheme } from '../utils/constants'

const PracticeContext = createContext(null)

/**
 * Resolves the practice slug from the URL.
 * 
 * Supports two patterns:
 *   /:slug          → slug from route param
 *   /intake/:slug   → slug from route param
 *   ?practice=slug  → slug from query param (fallback)
 *   (none)          → 'demo-clinic' default
 */
function useSlugFromURL() {
  const params = useParams()
  const location = useLocation()

  return useMemo(() => {
    // Route param takes priority
    if (params.slug) return params.slug

    // Query param fallback
    const query = new URLSearchParams(location.search)
    if (query.get('practice')) return query.get('practice')

    // Default for development
    return 'demo-clinic'
  }, [params.slug, location.search])
}

/**
 * Merges practice branding colors into the default theme.
 * Only overrides colors that the practice has configured.
 */
function buildTheme(branding) {
  if (!branding || Object.keys(branding).length === 0) return defaultTheme

  const merged = { ...defaultTheme }

  if (branding.primary_color) {
    merged.teal = branding.primary_color
    merged.primary = branding.primary_color
    merged.primaryDark = branding.primary_color
  }
  if (branding.accent_color) {
    merged.navy = branding.accent_color
    merged.secondary = branding.accent_color
  }
  // Practices can also send a full tealBg / tealLight override
  if (branding.primary_bg) {
    merged.tealBg = branding.primary_bg
  }
  if (branding.primary_light) {
    merged.tealLight = branding.primary_light
    merged.primaryLight = branding.primary_light
  }

  return merged
}

export function PracticeProvider({ children }) {
  const slug = useSlugFromURL()

  const [practiceConfig, setPracticeConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const config = await fetchPracticeConfig(slug)
        if (cancelled) return

        if (config) {
          setPracticeConfig(config)
        } else {
          // Practice not found — still allow the app to render with defaults
          console.warn(`Practice "${slug}" not found, using defaults`)
          setPracticeConfig(null)
        }
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load practice config:', err)
        setError(err.message)
        setPracticeConfig(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  const value = useMemo(() => {
    const branding = practiceConfig?.branding || {}
    const mergedTheme = buildTheme(branding)

    return {
      slug,
      loading,
      error,

      // Practice identity
      practiceName: practiceConfig?.name || null,
      logoUrl: practiceConfig?.logo_url || null,
      branding,

      // Merged theme (default + practice overrides)
      theme: mergedTheme,

      // Form config
      formConfig: practiceConfig?.form_config || {},
      enabledSteps: practiceConfig?.form_config?.enabled_steps || null,
      concernOptions: practiceConfig?.form_config?.concern_options || null,

      // White-label: whether to show "Powered by GlowaAI"
      // Practices can set branding.hide_powered_by = true to suppress it
      showPoweredBy: !branding.hide_powered_by,

      // Raw config for anything else
      raw: practiceConfig,
    }
  }, [slug, loading, error, practiceConfig])

  return (
    <PracticeContext.Provider value={value}>
      {children}
    </PracticeContext.Provider>
  )
}

/**
 * Hook to access practice config anywhere in the component tree.
 * 
 * Usage:
 *   const { theme, practiceName, slug, loading } = usePractice()
 */
export function usePractice() {
  const ctx = useContext(PracticeContext)
  if (!ctx) {
    throw new Error('usePractice must be used within <PracticeProvider>')
  }
  return ctx
}
