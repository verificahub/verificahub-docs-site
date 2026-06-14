import { C, FONT } from '../theme'

/** "hub" inside a smooth rounded-square, stroke only (CSS border). */
function HubBadge({ height, onDark }: { height: number; onDark: boolean }) {
  const color = onDark ? C.cream : C.ink
  const stroke = onDark ? 'rgba(236,231,219,0.45)' : 'rgba(22,19,14,0.28)'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        padding: `0 ${height * 0.2}px`,
        border: `1.5px solid ${stroke}`,
        borderRadius: height * 0.32,
        fontFamily: FONT.display,
        fontWeight: 700,
        fontSize: height * 0.5,
        letterSpacing: '-0.01em',
        color,
        lineHeight: 1,
        flex: '0 0 auto',
        boxSizing: 'border-box',
        transform: 'translate(-2px, 1px)',
      }}
    >
      HUB
    </span>
  )
}

/**
 * Brand wordmark: "Verifica" + a smooth outlined "hub" badge.
 */
export function Wordmark({ fontSize = 18, onDark = false }: { fontSize?: number; onDark?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: fontSize * 0.36 }}>
      <span
        style={{
          fontFamily: FONT.display,
          fontSize,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          color: onDark ? C.cream : C.ink,
          lineHeight: 1,
        }}
      >
        Verifica
      </span>
      <HubBadge height={fontSize * 1.5} onDark={onDark} />
    </span>
  )
}
