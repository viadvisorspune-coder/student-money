/**
 * ₹ with Indian digit grouping. Port of `formatINR` in the component bundle.
 *
 * Every amount shown anywhere in the app goes through this (CLAUDE.md §7).
 * The minus is U+2212 MINUS SIGN, not a hyphen, so it lines up with the digits.
 */
export function formatINR(n: number, o: { sign?: boolean; decimals?: number } = {}): string {
  const d = o.decimals || 0
  const s = Math.abs(n).toLocaleString('en-IN', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
  const sign = n < 0 ? '−' : o.sign && n > 0 ? '+' : ''
  return sign + '₹' + s
}

/** Shorthand used throughout the screens, matching the prototype's `F`. */
export const F = formatINR
