import { MARK_TF, PATH_CHECK, PATH_V, VB_NATURAL, VB_BADGE, BADGE, ASPECT, badgeMarkTransform, VB_SQUARE, SQUARE_RECT, squareMarkTransform } from './markGeometry'
import { C } from '../theme'

type LogoProps = {
  /** rendered height in px (width follows the mark's natural ratio, or square when badged) */
  size?: number
  /** use light strokes for placement on the dark ink background (no badge) */
  onDark?: boolean
  /** draw the mark inside a filled "badge" (app-icon style) */
  badge?: 'ink' | 'lime' | 'cream' | null
  /** badge shape (only when badge is set) */
  shape?: 'circle' | 'square'
}

function Mark({ vColor, checkColor }: { vColor: string; checkColor: string }) {
  return (
    <g transform={MARK_TF} stroke="none">
      <path d={PATH_CHECK} fill={checkColor} />
      <path d={PATH_V} fill={vColor} />
    </g>
  )
}

/**
 * Verificahub mark. Colours adapt to the surface so it stays legible:
 * dark → cream V + lime check, light → ink V + lime check, lime → all ink.
 */
export function Logo({ size = 30, onDark = false, badge = null, shape = 'circle' }: LogoProps) {
  const badgeFill = badge === 'ink' ? C.ink : badge === 'lime' ? C.lime : badge === 'cream' ? C.cream : null
  const surfaceDark = badge === 'ink' || (badge === null && onDark)
  const surfaceLime = badge === 'lime'

  const vColor = surfaceDark ? C.cream : C.ink
  const checkColor = surfaceLime ? C.ink : C.lime

  if (badgeFill) {
    if (shape === 'square') {
      return (
        <svg width={size} height={size} viewBox={VB_SQUARE} fill="none" role="img" aria-label="Verificahub">
          <rect x={SQUARE_RECT.x} y={SQUARE_RECT.y} width={SQUARE_RECT.size} height={SQUARE_RECT.size} rx={SQUARE_RECT.rx} fill={badgeFill} />
          <g transform={squareMarkTransform}>
            <Mark vColor={vColor} checkColor={checkColor} />
          </g>
        </svg>
      )
    }
    return (
      <svg width={size} height={size} viewBox={VB_BADGE} fill="none" role="img" aria-label="Verificahub">
        <circle cx={BADGE.cx} cy={BADGE.cy} r={BADGE.r} fill={badgeFill} />
        <g transform={badgeMarkTransform}>
          <Mark vColor={vColor} checkColor={checkColor} />
        </g>
      </svg>
    )
  }

  return (
    <svg
      width={Math.round(size * ASPECT)}
      height={size}
      viewBox={VB_NATURAL}
      fill="none"
      role="img"
      aria-label="Verificahub"
    >
      <Mark vColor={vColor} checkColor={checkColor} />
    </svg>
  )
}
