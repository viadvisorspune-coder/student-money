import { useState } from 'react'
import { cx } from '../lib/cx'
import { F } from '../lib/format'
import { Icon, NestedBreakdown } from '../ui'
import { outletOf } from '../state/selectors'
import type { Bucket, Txn } from '../data/types'
import type { NestItem, Tone } from '../ui/types'

export interface CategoryRow {
  id: string
  label: string
  amount: number
  pct: number
  tone?: Tone
}

interface Props {
  rows: CategoryRow[]
  buckets: Bucket[]
  txns: Txn[]
  /** A simulated spend folded into one category, for the Result screen. */
  pending?: { bucket: string | null; amount: number }
}

/**
 * Category shares, each one opening to the sections inside it.
 *
 * Closed, this is the share list: Eating 38%, Shopping 21%. Tapping a row opens the
 * nested breakdown for that category alone — the boxes within boxes — and closes
 * whichever was open, so only one is ever on screen. "Show all" opens every one at
 * once for a whole-month view.
 *
 * Every row and every block carries its name, amount and percentage as text, so the
 * hue is decoration rather than the only thing telling them apart.
 */
export function CategoryBars({ rows, buckets, txns, pending }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const widest = Math.max(...rows.map((r) => r.pct).concat([1]))
  const expandableRows = rows.filter((r) => !r.id.startsWith('__'))

  /** Section totals for one category, as blocks for the nested breakdown. */
  function sectionsOf(bucketId: string): NestItem[] {
    const bucket = buckets.filter((b) => b.id === bucketId)[0]
    if (!bucket) return []

    const sums: Record<string, number> = {}
    txns.forEach((t) => {
      if (t.income || t.bucket !== bucketId) return
      const o = outletOf(bucket, t)
      const key = o ? o.id : '__none'
      sums[key] = (sums[key] || 0) - t.amount
    })

    return bucket.outlets
      .map<NestItem>((o) => ({
        id: o.id,
        label: o.name,
        amount: sums[o.id] || 0,
        caption: o.vendors.join(', '),
      }))
      .concat(
        sums.__none
          ? [{ id: '__none', label: 'Not in a section yet', amount: sums.__none, caption: 'Vendors with no section' }]
          : [],
      )
      .filter((x) => x.amount > 0)
  }

  return (
    <div className="catbars">
      {rows.map((r) => {
        // "Other" and "Unlabelled" are folds, not categories, so they have nothing inside.
        const expandable = !r.id.startsWith('__')
        const isOpen = expandable && (showAll || open === r.id)
        const sections = isOpen ? sectionsOf(r.id) : []
        const pendingHere = pending && pending.bucket === r.id ? pending.amount : 0

        return (
          <div key={r.id} className={cx('catbar', isOpen && 'open')}>
            <button
              type="button"
              className="catbar-row"
              aria-expanded={expandable ? isOpen : undefined}
              onClick={() => {
                if (!expandable) return
                // Opening one closes whichever was open, and leaves show-all.
                setShowAll(false)
                setOpen(open === r.id && !showAll ? null : r.id)
              }}
            >
              <span className="n">
                {r.label}
                {expandable ? <Icon name="chevron-down" size={16} className="caret" /> : null}
              </span>
              <span className="bar">
                <span
                  className={'fill t-' + (r.tone || 'sky')}
                  style={{ width: Math.max(4, (r.pct / widest) * 100) + '%' }}
                />
              </span>
              <span className="p">{r.pct + '%'}</span>
            </button>

            {isOpen ? (
              <div className="catbar-body">
                <p className="catbar-total">
                  <span className="k">{`${r.label} so far`}</span>
                  <span className="v">{F(r.amount)}</span>
                  {pendingHere ? (
                    <span className="catbar-pending">{`includes ${F(pendingHere)} you are checking`}</span>
                  ) : null}
                </p>
                {sections.length ? (
                  <NestedBreakdown
                    items={sections}
                    color={r.tone}
                    height={240}
                    label={`${r.label} by section`}
                  />
                ) : (
                  <p className="muted">Nothing recorded in a section here yet.</p>
                )}
              </div>
            ) : null}
          </div>
        )
      })}

      {expandableRows.length > 1 ? (
        <button
          type="button"
          className="catbar-all"
          aria-pressed={showAll}
          onClick={() => {
            setShowAll((v) => !v)
            setOpen(null)
          }}
        >
          {showAll ? 'Show one at a time' : 'Show all'}
        </button>
      ) : null}
    </div>
  )
}
