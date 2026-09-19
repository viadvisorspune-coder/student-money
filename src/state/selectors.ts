import { DAYS_IN_MONTH, TODAY, isWeekend, weekdayIndex } from '../lib/calendar'
import {
  CUE_LOOKBACK_OCCURRENCES,
  MIN_PATTERN_SAMPLE,
  OPENING_BALANCE,
  PROJECTION_ROUNDING,
  SMALL_OUTING_MAX,
  SPLIT_TOP_N,
} from '../data/assumptions'
import { F } from '../lib/format'
import type { Bucket, Outlet, ResolvedBucket, Txn } from '../data/types'
import type { Tone } from '../ui/types'

/**
 * Every derived figure in the app. Ported from prototype/screens-v2.js.
 *
 * Two invariants hold across this whole module:
 *  - No function reads `Plan.amount`. Plans are cues, never money (CLAUDE.md §2.4).
 *  - No function compares the student with anyone else. Insights are ipsative or
 *    contextual only (§2.2), and none of them returns a verdict (§2.3).
 */

export type BucketMap = Record<string, Bucket>

export function bucketMap(buckets: Bucket[]): BucketMap {
  const m: BucketMap = {}
  buckets.forEach((b) => {
    m[b.id] = b
  })
  return m
}

/** The section a payment belongs to: the student's own choice first, then the vendor list. */
export function outletOf(bk: Bucket | undefined | null, t: Txn): Outlet | null {
  if (!bk || !bk.outlets) return null
  const chosen = t.outlet ? bk.outlets.filter((x) => x.id === t.outlet)[0] : undefined
  if (chosen) return chosen
  return bk.outlets.filter((x) => x.vendors.indexOf(t.vendor) > -1)[0] || null
}

/** Resolve a payment to its category and section, or to "needs a label". */
export function resolveBucket(bmap: BucketMap, t: Txn): ResolvedBucket {
  if (t.income) return { name: 'Income', icon: 'wallet', color: 'positive' }
  const bk = t.bucket ? bmap[t.bucket] : undefined
  if (!bk) return { name: 'Needs a label', icon: 'filter', color: 'soft', unlabelled: true }
  const o = outletOf(bk, t)
  return {
    name: bk.name,
    icon: bk.icon,
    color: bk.color,
    outletName: o ? o.name : 'Other',
    outletId: o ? o.id : '__none',
  }
}

export function totalIn(txns: Txn[]): number {
  return txns.filter((t) => t.income).reduce((a, t) => a + t.amount, 0)
}

export function totalOut(txns: Txn[]): number {
  return -txns.filter((t) => !t.income).reduce((a, t) => a + t.amount, 0)
}

/** Money out per category this month. `__none` collects the unlabelled payments. */
export function spentByBucket(txns: Txn[]): Record<string, number> {
  const by: Record<string, number> = {}
  txns.forEach((t) => {
    if (t.income) return
    const k = t.bucket || '__none'
    by[k] = (by[k] || 0) - t.amount
  })
  return by
}

export function balanceOf(income: number, spent: number): number {
  return OPENING_BALANCE + income - spent
}

/**
 * What the month would come to if the days left go like the days so far.
 * An assumption, stated as one — never a prediction and never a verdict (§2.3).
 */
export function project(spent: number, extra = 0): number {
  const rate = (spent + extra) / TODAY
  return Math.round((spent + extra + rate * (DAYS_IN_MONTH - TODAY)) / PROJECTION_ROUNDING) * PROJECTION_ROUNDING
}

export interface Split {
  id: string
  label: string
  pct: number
  tone?: Tone
  amount: number
}

/**
 * The month's spending as shares, top three plus "Other".
 * `extra`/`extraBucket` fold in a simulated spend without recording anything (§2.5).
 */
export function splitsOf(
  buckets: Bucket[],
  spentBy: Record<string, number>,
  extra = 0,
  extraBucket: string | null = null,
): Split[] {
  const by: Record<string, number> = { ...spentBy }
  if (extra && extraBucket) by[extraBucket] = (by[extraBucket] || 0) + extra

  const total = Object.keys(by).reduce((a, k) => a + by[k], 0) || 1
  const list = buckets
    .map((bk) => ({ id: bk.id, label: bk.name, amount: by[bk.id] || 0, tone: bk.color as Tone }))
    .filter((x) => x.amount > 0)

  if (by.__none) list.push({ id: '__none', label: 'Unlabelled', amount: by.__none, tone: 'soft' })
  list.sort((a, b) => b.amount - a.amount)

  const top = list.slice(0, SPLIT_TOP_N)
  const rest = list.slice(SPLIT_TOP_N)
  if (rest.length) {
    top.push({
      id: '__other',
      label: 'Other',
      amount: rest.reduce((a, x) => a + x.amount, 0),
      tone: 'soft',
    })
  }

  return top.map((x) => ({
    id: x.id,
    label: x.label,
    pct: Math.round((x.amount / total) * 100),
    tone: x.tone,
    amount: x.amount,
  }))
}

export interface Pattern {
  kind: string
  text: string
  detail?: string
  tone?: 'soft' | 'butter' | 'sky' | 'surface'
}

/**
 * Ipsative patterns: the student against their own history, stated and then stopped.
 * Nothing here says "you should", "too much" or "you overspent" (§2.3).
 */
export function patternsOf(txns: Txn[], bmap: BucketMap, spentBy: Record<string, number>): Pattern[] {
  const out = txns.filter((t) => !t.income)
  const social = out.filter((t) => t.social)
  const socialTotal = -social.reduce((a, t) => a + t.amount, 0)
  const weekend = social.filter((t) => isWeekend(t.day))
  const weekday = social.filter((t) => !isWeekend(t.day))
  const avg = (l: Txn[]) => (l.length ? Math.round(-l.reduce((a, t) => a + t.amount, 0) / l.length) : 0)

  const eat = bmap.eat
  const eatSpent = spentBy.eat || 0
  const small = out.filter((t) => -t.amount <= SMALL_OUTING_MAX && t.social)
  const smallTotal = -small.reduce((a, t) => a + t.amount, 0)
  const spontaneous = social.filter((t) => !t.planned)

  const list: Pattern[] = []

  if (eat && eat.usual) {
    list.push({
      kind: 'You vs yourself',
      text: `Eating is ${F(eatSpent)} this month. Your usual range by this date is ${F(eat.usual[0])}–${F(eat.usual[1])}.`,
      detail:
        eatSpent > eat.usual[1] ? 'Above your usual range, mostly from delivery apps.' : 'Inside your usual range.',
    })
  }

  // Only worth stating once there is something to state. With no outings this would
  // read "₹0 across 0 occasions", which is a sentence about nothing.
  if (social.length > 0) {
    list.push({
      kind: 'You vs yourself',
      text: `Social outings come to ${F(socialTotal)} across ${social.length} occasions this month.`,
      detail: `${spontaneous.length} of them were decided on the day.`,
    })
  }

  // Both sides need enough observations before a split is worth stating. With the
  // demo month this suppresses the pattern: one weekend outing is not a weekend
  // average. Set MIN_PATTERN_SAMPLE to 1 for the prototype's behaviour.
  if (weekend.length >= MIN_PATTERN_SAMPLE && weekday.length >= MIN_PATTERN_SAMPLE) {
    list.push({
      kind: 'This changes when…',
      tone: 'butter',
      text: `A weekday outing averages ${F(avg(weekday))}. On weekends it averages ${F(avg(weekend))}.`,
      // The basis is stated per side, not as one total, so the reader can see how
      // thin or thick each average is (design/CLAUDE.md §7).
      detail: `Based on ${weekday.length} weekday and ${weekend.length} weekend outings this month.`,
    })
  }

  if (small.length > 2) {
    list.push({
      kind: 'Adds up',
      tone: 'sky',
      text: `${small.length} small outings of ${F(SMALL_OUTING_MAX)} or less came to ${F(smallTotal)} together.`,
      detail: 'Each one looked small on its own.',
    })
  }

  return list
}

/**
 * What the student spent, on average, on the last N occurrences of a given weekday.
 *
 * This is what a notification cue quotes back before a known spending moment. It is
 * their own history and nothing else (design/CLAUDE.md §2.2), and the cue states it
 * without drawing a conclusion from it (§2.3).
 *
 * Days with no spending still count as occurrences, so a quiet Friday pulls the
 * average down rather than being dropped from the sample.
 */
export function weekdayAverage(
  txns: Txn[],
  weekday: number,
  lookback: number = CUE_LOOKBACK_OCCURRENCES,
): { average: number; occurrences: number } {
  const days: number[] = []
  for (let d = TODAY - 1; d >= 1 && days.length < lookback; d--) {
    if (weekdayIndex(d) === weekday) days.push(d)
  }
  if (!days.length) return { average: 0, occurrences: 0 }

  const total = -txns
    .filter((t) => !t.income && days.indexOf(t.day) > -1)
    .reduce((a, t) => a + t.amount, 0)

  return { average: Math.round(total / days.length), occurrences: days.length }
}
