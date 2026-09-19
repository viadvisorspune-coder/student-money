import type { IconName, Tone } from '../ui/types'

/**
 * The data model.
 *
 * Note what is absent by design: there is no `limit`, `cap`, `budget` or
 * `setAside` field anywhere, on any type. CLAUDE.md §2.1 forbids storing one.
 * A plan carries an `amount` the student typed, but it is a string shown back
 * to them and never enters a total (§2.4) — see `selectors.ts`, where no
 * derived figure reads it.
 */

/** A section inside a category: where inside it the money went. */
export interface Outlet {
  id: string
  name: string
  vendors: string[]
}

/** A category: a kind of spending. Renameable, movable and deletable (§2.6). */
export interface Bucket {
  id: string
  name: string
  icon: IconName
  color: Tone
  /** The student's own range by this date, used only for ipsative insights (§2.2). */
  usual?: [number, number]
  outlets: Outlet[]
}

export interface Txn {
  id: string
  day: number
  time: string
  /** Who it was paid to. Shown as supporting detail only, never as the headline (§2.7). */
  vendor: string
  /** What it was for, read from the payment remark. The headline on every row. */
  forLabel: string
  /** Negative is money out, positive is money in. */
  amount: number
  /** null means "needs a label" — never auto-assigned silently (§2.6). */
  bucket: string | null
  income: boolean
  social: boolean
  planned: boolean
  outlet: string | null
  note: string
  frequent: boolean
}

export type PlanSection = 'scheduled' | 'tbd'

export interface Plan {
  id: string
  section: PlanSection
  title: string
  when: string
  /** What the student has in mind. Displayed back, never counted (§2.4). */
  amount: string
  notes: string
  done: boolean
}

/** A checked-but-not-made spend. Records nothing against any total (§2.5). */
export interface Skip {
  id: string
  amount: number
  label: string
}

export interface Decision {
  amount: number
  label: string
  bucket: string | null
}

/** The category a transaction resolves to, with its section. */
export interface ResolvedBucket {
  name: string
  icon: IconName
  color: Tone
  outletName?: string
  outletId?: string
  unlabelled?: boolean
}
