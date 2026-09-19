import { BUCKETS, PLANS, TXNS } from '../data/seed'
import type { Bucket, Plan, Skip, Txn } from '../data/types'

/**
 * Remembering what the student entered.
 *
 * Everything they do — a payment added by hand, a relabelled transaction, a renamed
 * category, a plan — is written here and read back on the next load. Without it the
 * app rebuilds itself from `seed.ts` on every refresh and their work is lost.
 *
 * The store is the browser's own localStorage, so the data stays on the device and
 * never reaches a server. That is what keeps the onboarding promise ("Nothing leaves
 * your phone") true, and it is why this file is the only place that touches storage:
 * swapping it for a backend later means changing `load` and `save`, nothing else.
 *
 * Every read and write is wrapped, because localStorage throws rather than returning
 * empty in a private window or with site data blocked. A failure is never fatal — the
 * app falls back to the demo data and carries on.
 */

const KEY = 'student-money'

/** Bump when the shape below changes; a mismatch falls back to the demo data. */
const VERSION = 1

export interface PersistedState {
  version: number
  buckets: Bucket[]
  txns: Txn[]
  plans: Plan[]
  skipped: Skip[]
}

export const SEED: Omit<PersistedState, 'version'> = {
  buckets: BUCKETS,
  txns: TXNS,
  plans: PLANS,
  skipped: [],
}

function isUsable(v: unknown): v is PersistedState {
  if (!v || typeof v !== 'object') return false
  const s = v as Partial<PersistedState>
  return (
    s.version === VERSION &&
    Array.isArray(s.buckets) &&
    Array.isArray(s.txns) &&
    Array.isArray(s.plans) &&
    Array.isArray(s.skipped)
  )
}

/** What the student had last time, or the demo data if there is nothing usable. */
export function load(): Omit<PersistedState, 'version'> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return SEED
    const parsed: unknown = JSON.parse(raw)
    if (!isUsable(parsed)) return SEED
    const { buckets, txns, plans, skipped } = parsed
    return { buckets, txns, plans, skipped }
  } catch {
    // Private window, blocked site data, or a half-written value. Start from the demo.
    return SEED
  }
}

export function save(state: Omit<PersistedState, 'version'>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, ...state }))
  } catch {
    // Storage full or unavailable. The session still works; it just will not be
    // remembered, which is better than interrupting the student to say so.
  }
}

/** Forget everything and go back to the demo month. */
export function clear(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
}
