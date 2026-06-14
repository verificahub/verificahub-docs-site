// Verificahub brand palette — values resolve to the CSS variables defined in
// :root (src/index.css), so there is a single source of truth for colours.
export const C = {
  bg: 'var(--vh-bg)',
  ink: 'var(--vh-ink)',
  inkSoft: 'var(--vh-ink-soft)',
  lime: 'var(--vh-lime)',
  limeHover: 'var(--vh-lime-deep)',
  cream: 'var(--vh-bg)',
  card: 'var(--vh-surface)',
  cardBorder: 'var(--vh-card-border)',
  hairline: 'var(--vh-hairline)',
  textMuted: 'var(--vh-text-muted)',
  textSubtle: 'var(--vh-text-subtle)',
  mono: 'var(--vh-mono)',
} as const

export const FONT = {
  display: "'Unbounded', sans-serif",
  body: "'Golos Text', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const
