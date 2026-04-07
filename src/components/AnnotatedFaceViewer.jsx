import { useState, useRef, useEffect, useCallback } from 'react'
import { theme } from '../utils/constants'

const FINDING_COLORS = {
  wrinkles: '#4CAF50', fine_lines: '#8BC34A', pigmentation: '#FF9800',
  dark_circles: '#9C27B0', texture: '#2196F3', pores: '#00BCD4',
  redness: '#F44336', volume_loss: '#607D8B', sagging: '#795548',
}
const FINDING_LABELS = {
  wrinkles: 'Wrinkles', fine_lines: 'Fine Lines', pigmentation: 'Pigmentation',
  dark_circles: 'Dark Circles', texture: 'Texture', pores: 'Pores',
  redness: 'Redness', volume_loss: 'Volume Loss', sagging: 'Sagging',
}
const FINDING_ICONS = {
  wrinkles: '〰️', fine_lines: '〰️', pigmentation: '●', dark_circles: '◐',
  texture: '◌', pores: '∘', redness: '◉', volume_loss: '▽', sagging: '↓',
}
const SEVERITY_OPACITY = { mild: 0.5, moderate: 0.7, significant: 0.9 }

// Padding fraction used for cropping — must match in both crop and remap
const CROP_PAD = 0.10

/**
 * Compute the actual crop rect in percentage space.
 * This is the single source of truth used by BOTH the canvas crop
 * AND the SVG coordinate remapping.
 */
function getCropRect(faceBounds) {
  if (!faceBounds) return null
  return {
    x: Math.max(0, faceBounds.x - faceBounds.width * CROP_PAD),
    y: Math.max(0, faceBounds.y - faceBounds.height * CROP_PAD),
    width: Math.min(100, faceBounds.width * (1 + 2 * CROP_PAD)),
    height: Math.min(100, faceBounds.height * (1 + 2 * CROP_PAD)),
  }
}

// Remap coordinates from full-image space to cropped-face space
function remapCoord(x, y, cropRect) {
  if (!cropRect) return [x, y]
  const newX = ((x - cropRect.x) / cropRect.width) * 100
  const newY = ((y - cropRect.y) / cropRect.height) * 100
  return [newX, newY]
}

function remapPaths(paths, cropRect) {
  if (!paths || !cropRect) return paths
  return paths.map(path => {
    if (!Array.isArray(path)) return path
    return path.map(point => {
      if (Array.isArray(point) && point.length === 2) {
        return remapCoord(point[0], point[1], cropRect)
      }
      return point
    })
  })
}

function remapRegion(region, cropRect) {
  if (!region || !cropRect) return region
  const [cx, cy] = remapCoord(region.x, region.y, cropRect)
  return {
    x: cx, y: cy,
    width: (region.width / cropRect.width) * 100,
    height: (region.height / cropRect.height) * 100,
  }
}

function pointsToSmoothPath(points) {
  if (!points || points.length < 2) return ''
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    const prev = i > 0 ? points[i - 1] : curr
    const afterNext = i < points.length - 2 ? points[i + 2] : next
    const tension = 0.25
    const cp1x = curr[0] + (next[0] - prev[0]) * tension
    const cp1y = curr[1] + (next[1] - prev[1]) * tension
    const cp2x = next[0] - (afterNext[0] - curr[0]) * tension
    const cp2y = next[1] - (afterNext[1] - curr[1]) * tension
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next[0]},${next[1]}`
  }
  return d
}

function LineFinding({ finding, isSelected, onClick, cropRect }) {
  const color = FINDING_COLORS[finding.type] || '#4CAF50'
  const opacity = SEVERITY_OPACITY[finding.severity] || 0.5
  const paths = remapPaths(finding.paths, cropRect) || []
  if (paths.length === 0) return null

  const allPoints = paths.flat().filter(p => Array.isArray(p))
  const centerX = allPoints.reduce((s, p) => s + p[0], 0) / allPoints.length
  const minY = Math.min(...allPoints.map(p => p[1]))

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {paths.map((pathPoints, i) => {
        if (!Array.isArray(pathPoints) || pathPoints.length < 2) return null
        const points = Array.isArray(pathPoints[0]) ? pathPoints :
          Array.from({ length: Math.floor(pathPoints.length / 2) }, (_, j) =>
            [pathPoints[j * 2], pathPoints[j * 2 + 1]])
        const d = pointsToSmoothPath(points)
        if (!d) return null
        return (
          <path key={i} d={d} fill="none" stroke={color}
            strokeWidth={isSelected ? 0.8 : 0.5}
            opacity={isSelected ? 0.95 : opacity}
            strokeLinecap="round" strokeLinejoin="round" />
        )
      })}
      <circle cx={centerX} cy={Math.max(1.5, minY - 2.5)}
        r={isSelected ? 1.8 : 1.3} fill={color}
        stroke="white" strokeWidth={0.3}
        opacity={isSelected ? 1 : 0.8}>
        {!isSelected && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
      </circle>
    </g>
  )
}

function RegionFinding({ finding, isSelected, onClick, cropRect }) {
  const color = FINDING_COLORS[finding.type] || '#FF9800'
  const opacity = SEVERITY_OPACITY[finding.severity] || 0.5
  const region = remapRegion(finding.region, cropRect)
  if (!region) return null

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <ellipse cx={region.x} cy={region.y}
        rx={region.width / 2} ry={region.height / 2}
        fill={color} opacity={isSelected ? 0.3 : opacity * 0.25}
        stroke={color} strokeWidth={isSelected ? 0.5 : 0.3}
        strokeOpacity={isSelected ? 0.9 : 0.5} />
      <circle cx={region.x} cy={Math.max(1.5, region.y - region.height / 2 - 2)}
        r={isSelected ? 1.8 : 1.3} fill={color}
        stroke="white" strokeWidth={0.3}
        opacity={isSelected ? 1 : 0.8}>
        {!isSelected && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
      </circle>
    </g>
  )
}

// Crop image to face bounds using canvas
function CroppedFaceImage({ photoDataUrl, faceBounds, onDimensions }) {
  const canvasRef = useRef(null)
  const [croppedUrl, setCroppedUrl] = useState(null)

  useEffect(() => {
    if (!photoDataUrl || !faceBounds) {
      setCroppedUrl(photoDataUrl)
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Use the same CROP_PAD constant as the SVG remap
      const cropRect = getCropRect(faceBounds)
      const fx = (cropRect.x / 100) * img.width
      const fy = (cropRect.y / 100) * img.height
      const fw = (cropRect.width / 100) * img.width
      const fh = (cropRect.height / 100) * img.height

      canvas.width = fw
      canvas.height = fh
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, fx, fy, fw, fh, 0, 0, fw, fh)

      setCroppedUrl(canvas.toDataURL('image/jpeg', 0.9))

      // Report the aspect ratio so SVG viewBox can match
      if (onDimensions) onDimensions({ width: fw, height: fh })
    }
    img.src = photoDataUrl
  }, [photoDataUrl, faceBounds, onDimensions])

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {croppedUrl ? (
        <img src={croppedUrl} alt="Face analysis" style={{ width: '100%', display: 'block' }} />
      ) : (
        <img src={photoDataUrl} alt="Face analysis" style={{ width: '100%', display: 'block' }} />
      )}
    </>
  )
}

export default function AnnotatedFaceViewer({ photoDataUrl, findings = [], faceBounds = null }) {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [imageDims, setImageDims] = useState(null)
  const selectedFinding = selectedIdx !== null ? findings[selectedIdx] : null
  const hasLinePaths = (f) => f.paths && Array.isArray(f.paths) && f.paths.length > 0

  // Single source of truth for the crop rect
  const cropRect = getCropRect(faceBounds)

  // Compute SVG viewBox that matches the image aspect ratio
  // This prevents the preserveAspectRatio="none" distortion
  const svgViewBox = imageDims
    ? `0 0 100 ${(imageDims.height / imageDims.width) * 100}`
    : '0 0 100 133' // default 3:4 fallback

  const handleDimensions = useCallback((dims) => {
    setImageDims(dims)
  }, [])

  return (
    <div>
      <div style={{
        position: 'relative', width: '100%', borderRadius: 16,
        overflow: 'hidden', background: '#1a1a1a', marginBottom: 12,
      }}>
        {photoDataUrl ? (
          <CroppedFaceImage
            photoDataUrl={photoDataUrl}
            faceBounds={faceBounds}
            onDimensions={handleDimensions}
          />
        ) : (
          <div style={{
            width: '100%', aspectRatio: '3/4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#666', fontSize: 14,
          }}>No photo available</div>
        )}

        {findings.length > 0 && (
          <svg viewBox={svgViewBox} preserveAspectRatio="xMidYMid meet"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            onClick={() => setSelectedIdx(null)}>
            {findings.map((finding, i) => {
              if (hasLinePaths(finding)) {
                return <LineFinding key={i} finding={finding} cropRect={cropRect}
                  isSelected={selectedIdx === i}
                  onClick={(e) => { e.stopPropagation(); setSelectedIdx(selectedIdx === i ? null : i) }} />
              }
              if (finding.region) {
                return <RegionFinding key={i} finding={finding} cropRect={cropRect}
                  isSelected={selectedIdx === i}
                  onClick={(e) => { e.stopPropagation(); setSelectedIdx(selectedIdx === i ? null : i) }} />
              }
              return null
            })}
          </svg>
        )}

        {findings.length > 0 && selectedIdx === null && (
          <div style={{
            position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: '6px 14px',
            fontSize: 12, color: 'white', whiteSpace: 'nowrap',
          }}>Tap a marker to see details</div>
        )}
      </div>

      {selectedFinding && (
        <div style={{
          background: theme.surface, borderRadius: 12,
          border: `2px solid ${FINDING_COLORS[selectedFinding.type] || theme.primary}`,
          padding: 16, marginBottom: 12, animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${FINDING_COLORS[selectedFinding.type] || theme.primary}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>{FINDING_ICONS[selectedFinding.type] || '●'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{selectedFinding.label}</div>
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
                color: FINDING_COLORS[selectedFinding.type] || theme.textLight }}>
                {selectedFinding.severity} · {selectedFinding.zone?.replace('_', ' ')}
              </div>
            </div>
            <button onClick={() => setSelectedIdx(null)} style={{
              background: 'none', border: 'none', fontSize: 20,
              color: theme.textMuted, padding: '4px 8px', cursor: 'pointer',
            }}>×</button>
          </div>
          <p style={{ fontSize: 14, color: theme.textLight, lineHeight: 1.5, margin: 0 }}>
            {selectedFinding.description}
          </p>
        </div>
      )}

      {findings.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {[...new Set(findings.map(f => f.type))].map(type => (
            <div key={type} style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: theme.textLight,
              padding: '4px 10px', borderRadius: 16,
              background: `${FINDING_COLORS[type] || '#999'}10`,
              border: `1px solid ${FINDING_COLORS[type] || '#999'}30`,
            }}>
              <span style={{ color: FINDING_COLORS[type], fontSize: 10 }}>●</span>
              {FINDING_LABELS[type] || type}
            </div>
          ))}
        </div>
      )}

      <div style={{
        background: theme.surface, borderRadius: 12,
        border: `1px solid ${theme.border}`, overflow: 'hidden',
      }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 1, padding: '14px 16px 10px',
        }}>Findings ({findings.length})</div>
        {findings.map((finding, i) => (
          <div key={i}
            onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderTop: `1px solid ${theme.border}`,
              cursor: 'pointer',
              background: selectedIdx === i ? `${FINDING_COLORS[finding.type] || theme.primary}08` : 'transparent',
              transition: 'background 0.2s',
            }}>
            <div style={{ width: 8, height: 8, borderRadius: 4,
              background: FINDING_COLORS[finding.type] || '#999', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{finding.label}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, textTransform: 'capitalize' }}>
                {finding.severity} · {finding.zone?.replace('_', ' ')}
              </div>
            </div>
            <div style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600, textTransform: 'capitalize',
              background: finding.severity === 'mild' ? `${theme.success}15` :
                finding.severity === 'moderate' ? `${theme.accent}15` : `${theme.error}15`,
              color: finding.severity === 'mild' ? theme.success :
                finding.severity === 'moderate' ? theme.accent : theme.error,
            }}>{finding.severity}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
