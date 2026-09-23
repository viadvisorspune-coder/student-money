import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { NO_OVERRIDES, SEED, clear as clearStored, load, save, type Overrides } from './persistence'
import type { Bucket, Decision, Plan, PlanSection, Skip, Txn } from '../data/types'
import type { TermKey } from '../data/terms'
import {
  balanceOf,
  bucketMap,
  patternsOf,
  project,
  resolveBucket,
  splitsOf,
  spentByBucket,
  totalIn,
  totalOut,
  type BucketMap,
  type Pattern,
  type Split,
} from './selectors'

export interface LabelPrompt {
  vendor: string
  bucket: string | null
  count: number
}

export interface Toast {
  message: string
  undo?: () => void
}

interface AppState {
  /* data */
  buckets: Bucket[]
  bmap: BucketMap
  txns: Txn[]
  plans: Plan[]
  skipped: Skip[]

  /* derived */
  income: number
  spent: number
  free: number
  balance: number
  spentBy: Record<string, number>
  cues: Plan[]
  patterns: Pattern[]
  resolve: (t: Txn) => ReturnType<typeof resolveBucket>
  projection: (extra?: number) => number
  splits: (extra?: number, extraBucket?: string | null) => Split[]

  /* the checked-but-not-recorded spend (CLAUDE.md §2.5) */
  decision: Decision | null
  setDecision: (d: Decision | null) => void

  /* per-category nested-block selection, kept across navigation */
  nestSel: Record<string, string | null>
  setNestSel: (b: Record<string, string | null>) => void

  /* overlays */
  editBucket: Bucket | null
  setEditBucket: (b: Bucket | null) => void
  openTxn: string | null
  setOpenTxn: (id: string | null) => void
  info: TermKey | null
  setInfo: (t: TermKey | null) => void
  addOpen: boolean
  setAdd: (v: boolean) => void
  labelPrompt: LabelPrompt | null
  setLabelPrompt: (p: LabelPrompt | null) => void

  /* onboarding */
  step: number
  setStep: (n: number) => void

  toast: Toast | null
  say: (message: string, undo?: () => void) => void
  dismissToast: () => void

  /* mutations */
  saveBucket: (b: Bucket) => void
  deleteBucket: (id: string) => void
  keepBuckets: (ids: string[]) => void
  saveTxn: (t: Txn) => void
  addTxn: (t: Txn) => void
  fileVendor: (bucketId: string, outletId: string, vendor: string) => void
  setPlans: (updater: (p: Plan[]) => Plan[]) => void
  updatePlan: (id: string, patch: Partial<Plan>) => void
  movePlan: (id: string, section: PlanSection, beforeId?: string) => void
  removePlan: (id: string) => void
  addPlan: (p: Plan) => void
  recordSkip: (s: Skip) => void
  /** Hand-entered figures standing in for the derived ones. */
  overrides: Overrides
  setOverrides: (o: Overrides) => void
  /** What the transactions actually say, whatever the overrides are set to. */
  realIncome: number
  realSpent: number
  /** Clear everything the app has stored and return to the demo data. */
  reset: () => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  // Read once, synchronously, so the first paint already shows the student's own
  // figures rather than the demo data flashing up and then being replaced.
  const [restored] = useState(load)

  const [buckets, setBuckets] = useState<Bucket[]>(restored.buckets)
  const [txns, setTxns] = useState<Txn[]>(restored.txns)
  const [plans, setPlansState] = useState<Plan[]>(restored.plans)
  const [skipped, setSkipped] = useState<Skip[]>(restored.skipped)
  const [overrides, setOverridesState] = useState<Overrides>(restored.overrides)

  const [decision, setDecision] = useState<Decision | null>(null)
  const [nestSel, setNestSel] = useState<Record<string, string | null>>({})
  const [editBucket, setEditBucket] = useState<Bucket | null>(null)
  const [openTxn, setOpenTxn] = useState<string | null>(null)
  const [info, setInfo] = useState<TermKey | null>(null)
  const [addOpen, setAdd] = useState(false)
  const [labelPrompt, setLabelPrompt] = useState<LabelPrompt | null>(null)
  const [step, setStep] = useState(0)
  const [toast, setToast] = useState<Toast | null>(null)

  // Anything the student changes is written back. Plans are saved here like the rest
  // — saving a plan's amount is not the same as counting it, and no selector reads it
  // (design/CLAUDE.md §2.4).
  useEffect(() => {
    save({ buckets, txns, plans, skipped, overrides })
  }, [buckets, txns, plans, skipped, overrides])

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const say = useCallback((message: string, undo?: () => void) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, undo })
    toastTimer.current = setTimeout(() => setToast(null), 6000)
  }, [])

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(null)
  }, [])

  const bmap = useMemo(() => bucketMap(buckets), [buckets])

  const realIncome = useMemo(() => totalIn(txns), [txns])
  const realSpent = useMemo(() => totalOut(txns), [txns])

  // A hand-entered figure stands in for the derived one, and everything downstream
  // follows from it — that is the point of entering it.
  const income = overrides.allowance ?? realIncome
  const spent = overrides.spent ?? realSpent

  /**
   * When the total spent is overridden, the per-category amounts are scaled to match
   * it. Without that the categories would still add up to the real month and every
   * share on every screen would be computed against the wrong total.
   */
  const spentBy = useMemo(() => {
    const real = spentByBucket(txns)
    if (overrides.spent == null || realSpent <= 0) return real
    const factor = overrides.spent / realSpent
    const scaled: Record<string, number> = {}
    Object.keys(real).forEach((k) => {
      scaled[k] = Math.round(real[k] * factor)
    })
    return scaled
  }, [txns, overrides.spent, realSpent])
  const free = income - spent
  const balance = balanceOf(income, spent)
  const cues = useMemo(() => plans.filter((p) => !p.done), [plans])
  const patterns = useMemo(() => patternsOf(txns, bmap, spentBy), [txns, bmap, spentBy])

  const resolve = useCallback((t: Txn) => resolveBucket(bmap, t), [bmap])
  const projection = useCallback((extra = 0) => project(spent, extra), [spent])
  const splits = useCallback(
    (extra = 0, extraBucket: string | null = null) => splitsOf(buckets, spentBy, extra, extraBucket),
    [buckets, spentBy],
  )

  /* ------------------------------------------------------------ mutations */

  const saveBucket = useCallback((nb: Bucket) => {
    setBuckets((bs) => (bs.some((x) => x.id === nb.id) ? bs.map((x) => (x.id === nb.id ? nb : x)) : bs.concat([nb])))
    setEditBucket(null)
  }, [])

  /** Deleting a category never deletes its payments — they go back to "needs a label" (§2.6). */
  const deleteBucket = useCallback(
    (id: string) => {
      const bSnap = buckets
      const tSnap = txns
      const name = bmap[id]?.name || 'Category'
      setBuckets((bs) => bs.filter((x) => x.id !== id))
      setTxns((ts) => ts.map((t) => (t.bucket === id ? { ...t, bucket: null } : t)))
      setEditBucket(null)
      say(name + ' deleted. Its payments need a label now.', () => {
        setBuckets(bSnap)
        setTxns(tSnap)
      })
    },
    [buckets, txns, bmap, say],
  )

  const keepBuckets = useCallback((ids: string[]) => {
    setBuckets((bs) => bs.filter((b) => ids.indexOf(b.id) > -1))
  }, [])

  const saveTxn = useCallback((nt: Txn) => {
    setTxns((ts) => ts.map((t) => (t.id === nt.id ? nt : t)))
    setOpenTxn(null)
  }, [])

  const addTxn = useCallback(
    (t: Txn) => {
      setTxns((ts) => ts.concat([t]))
      setAdd(false)
      say(`₹${Math.abs(t.amount).toLocaleString('en-IN')} added.`, () =>
        setTxns((ts) => ts.filter((x) => x.id !== t.id)),
      )
    },
    [say],
  )

  const fileVendor = useCallback(
    (bucketId: string, outletId: string, vendor: string) => {
      setBuckets((bs) =>
        bs.map((b) =>
          b.id !== bucketId
            ? b
            : {
                ...b,
                outlets: b.outlets.map((o) =>
                  o.id !== outletId
                    ? o
                    : { ...o, vendors: o.vendors.indexOf(vendor) < 0 ? o.vendors.concat([vendor]) : o.vendors },
                ),
              },
        ),
      )
      setLabelPrompt(null)
      say(vendor + ' filed. Future payments follow it.')
    },
    [say],
  )

  const setPlans = useCallback((updater: (p: Plan[]) => Plan[]) => setPlansState(updater), [])

  const updatePlan = useCallback((id: string, patch: Partial<Plan>) => {
    setPlansState((ps) => ps.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }, [])

  const movePlan = useCallback((id: string, section: PlanSection, beforeId?: string) => {
    setPlansState((ps) => {
      const item = ps.filter((x) => x.id === id)[0]
      if (!item) return ps
      const rest = ps.filter((x) => x.id !== id)
      const moved: Plan = { ...item, section }
      let idx = beforeId ? rest.findIndex((x) => x.id === beforeId) : -1
      if (idx < 0) {
        let last = -1
        rest.forEach((x, i) => {
          if (x.section === section) last = i
        })
        idx = last < 0 ? (section === 'scheduled' ? 0 : rest.length) : last + 1
      }
      rest.splice(idx, 0, moved)
      return rest
    })
  }, [])

  const removePlan = useCallback(
    (id: string) => {
      const snapshot = plans
      const title = plans.filter((p) => p.id === id)[0]?.title || 'Untitled plan'
      setPlansState((ps) => ps.filter((x) => x.id !== id))
      say(`“${title}” removed.`, () => setPlansState(snapshot))
    },
    [plans, say],
  )

  const addPlan = useCallback((p: Plan) => setPlansState((ps) => ps.concat([p])), [])

  /** A skip is a note to the student, nothing more. No total moves (§2.5). */
  const recordSkip = useCallback((s: Skip) => setSkipped((xs) => xs.concat([s])), [])

  /**
   * Forget everything and go back to the demo month. The brief requires the student be
   * able to clear what the app holds (§2.9); this is the mechanism. It has no control
   * in the approved design yet, so for now it is reachable from the console as
   * `window.studentMoney.reset()` — see README.
   */
  const reset = useCallback(() => {
    clearStored()
    setOverridesState(NO_OVERRIDES)
    setBuckets(SEED.buckets)
    setTxns(SEED.txns)
    setPlansState(SEED.plans)
    setSkipped(SEED.skipped)
    setDecision(null)
    setNestSel({})
    say('Everything cleared. Back to the demo month.')
  }, [say])

  // Until the design has a control for it, clearing is reachable from the browser
  // console as `studentMoney.reset()`.
  useEffect(() => {
    ;(window as unknown as { studentMoney?: { reset: () => void } }).studentMoney = { reset }
  }, [reset])

  const value: AppState = {
    buckets,
    bmap,
    txns,
    plans,
    skipped,
    income,
    spent,
    free,
    balance,
    spentBy,
    cues,
    patterns,
    resolve,
    projection,
    splits,
    decision,
    setDecision,
    nestSel,
    setNestSel,
    editBucket,
    setEditBucket,
    openTxn,
    setOpenTxn,
    info,
    setInfo,
    addOpen,
    setAdd,
    labelPrompt,
    setLabelPrompt,
    step,
    setStep,
    toast,
    say,
    dismissToast,
    saveBucket,
    deleteBucket,
    keepBuckets,
    saveTxn,
    addTxn,
    fileVendor,
    setPlans,
    updatePlan,
    movePlan,
    removePlan,
    addPlan,
    recordSkip,
    overrides,
    setOverrides: setOverridesState,
    realIncome,
    realSpent,
    reset,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}
