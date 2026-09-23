import { F } from './format'

/**
 * Reading what a plan carries, for display only.
 *
 * A plan holds a figure the student typed. It is shown back to them and nothing else:
 * no total, projection, chart or insight reads it (CLAUDE.md §2.4). That is exactly
 * why these two helpers live here and not in `selectors.ts`, where the standing
 * invariant is that nothing touches `Plan.amount`. Nothing in this file adds two plan
 * amounts together — a set-aside figure is a note to the student, never a subtotal.
 */

/** The digits the student typed, as a number. 0 when they have written none. */
export function planAmount(raw: string): number {
  return +String(raw ?? '').replace(/[^\d]/g, '') || 0
}

/** The same figure as a line to show beside the plan, or null when there is none. */
export function setAside(raw: string): string | null {
  const n = planAmount(raw)
  return n ? `${F(n)} set aside` : null
}
