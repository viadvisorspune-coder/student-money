import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { BUCKETS, PLANS, TXNS } from '../data/seed'
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
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [buckets, setBuckets] = useState<Bucket[]>(BUCKETS)
  const [txns, setTxns] = useState<Txn[]>(TXNS)
  const [plans, setPlansState] = useState<Plan[]>(PLANS)
  const [skipped, setSkipped] = useState<Skip[]>([])

  const [decision, setDecision] = useState<Decision | null>(null)
  const [nestSel, setNestSel] = useState<Record<string, string | null>>({})
  const [editBucket, setEditBucket] = useState<Bucket | null>(null)
  const [openTxn, setOpenTxn] = useState<string | null>(null)
  const [info, setInfo] = useState<TermKey | null>(null)
  const [addOpen, setAdd] = useState(false)
  const [labelPrompt, setLabelPrompt] = useState<LabelPrompt | null>(null)
  const [step, setStep] = useState(0)
  const [toast, setToast] = useState<Toast | null>(null)

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
  const income = useMemo(() => totalIn(txns), [txns])
  const spent = useMemo(() => totalOut(txns), [txns])
  const spentBy = useMemo(() => spentByBucket(txns), [txns])
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
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}
