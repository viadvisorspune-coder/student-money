/**
 * Date helpers for the demo month. Ported from prototype/screens-v2.js.
 *
 * The product's reference month is September 2026 (CLAUDE.md §1). Month index 8
 * is September; the year and month are held here so that swapping the demo data
 * for a live feed only touches this file.
 */
export const YEAR = 2026
export const MONTH = 8 // September, zero-indexed
export const TODAY = 17
export const DAYS_IN_MONTH = 30
export const OPENING = 15000

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/** Weekday name for a day of the demo month. */
export function wd(d: number): string {
  return WD[new Date(YEAR, MONTH, d).getDay()]
}

export function isWeekend(d: number): boolean {
  const x = new Date(YEAR, MONTH, d).getDay()
  return x === 0 || x === 6
}

/** 24h "21:40" to 12h "9:40 PM". */
export function t12(t: string): string {
  const p = t.split(':')
  const H = +p[0]
  return (H % 12 || 12) + ':' + p[1] + (H < 12 ? ' AM' : ' PM')
}

/** "Today" / "Yesterday" / "Wed, 12 Sep". */
export function dayLabel(d: number): string {
  return d === TODAY ? 'Today' : d === TODAY - 1 ? 'Yesterday' : wd(d) + ', ' + d + ' Sep'
}
