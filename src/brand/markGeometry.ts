// Geometry of the Verificahub brand mark. Plain (non-component) module so
// react-refresh stays happy. Mirrors the landing site's mark exactly.

export const MARK_TF =
  'matrix(0.025267001241445545,0,0,-0.024505000561475757,248.90180969238284,204.36860656738284)'
export const PATH_CHECK =
  'M 3653.92 2624 L 1924.28 1827.06 L 981.851 2607.42 L 1924.28 1376.45 L 3235.51 1995.94 L 3653.92 2624 Z'
export const PATH_V =
  'M 175.371 2621.26 C 1881.3 164.99 1920.1 120 1924.28 120 C 2989.83 1637.54 3042.96 1727.52 3042.96 1727.52 C 2601.07 1520.74 2162.31 1310.51 2162.31 1310.51 C 2162.31 1310.51 1927.41 966.01 1924.28 966.01 C 925.581 2393.57 761.425 2624.73 761.425 2624.73 C 282.971 2628.18 175.371 2621.26 175.371 2621.26 Z'

export const VB_NATURAL = '253.3329 140.026 87.8925 61.402'
export const ASPECT = 87.8925 / 61.402 // ~1.43, wider than tall

// Shared mark placement inside any badge (circle or square).
export const badgeMarkTransform = 'matrix(1.24,0,0,1.24,-20.466947555541992,-5.9634552001953125)'

// ---- circle badge ----
export const VB_BADGE = '261.321 110.382 174.554 174.554'
export const BADGE = { cx: 348.598, cy: 197.659, r: 87.277 }

// ---- rounded-square badge ----
export const VB_SQUARE = '277.696 130.968 140 140'
export const SQUARE_RECT = { x: 277.696, y: 130.968, size: 140, rx: 26 }
export const squareMarkTransform = badgeMarkTransform
