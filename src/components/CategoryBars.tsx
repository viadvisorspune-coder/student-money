import { useState } from 'react'
import { cx } from '../lib/cx'
import { F } from '../lib/format'
import { Icon } from '../ui'
import { outletOf } from '../state/selectors'
import type { Bucket, Txn } from '../data/types'
import type { Tone } from '../ui/types'

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
 * Closed, this is the share list: Eating 38%, Shopping 21%. Tapping a row expands it to
 * the sections underneath — Delivery apps, Cafés, Tapri & canteen — so the detail is
 * there when it is wanted and out of the way when it is not.
 *
 * Every row carries its name, amount and percentage as text, so the hue is decoration
 * rather than the only thing telling them apart.
 */
export function CategoryBars({ rows, buckets, txns, pending }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const widest = Math.max(...rows.map((r) => r.pct).concat([1]))

  /** Section totals for one category, including a simulated spend where it applies. */
  function sectionsOf(bucketId: string) {
    const bucket = buckets.filter((b) => b.id === bucketId)[0]
    if (!bucket) return []

    const sums: Record<string, number> = {}
    txns.forEach((t) => {
      if (t.income || t.bucket !== bucketId) return
      const o = outletOf(bucket, t)
      const key = o ? o.id : '__none'
      sums[key] = (sums[key] || 0) - t.amount
    })

    const list = bucket.outlets
      .map((o) => ({ id: o.id, label: o.name, amount: sums[o.id] || 0 }))
      .concat(sums.__none ? [{ id: '__none', label: 'Not in a section yet', amount: sums.__none }] : [])
      .filter((x) => x.amount > 0)
      .sort((a, b) => b.amount - a.amount)

    return list
  }

  return (
    <div className="catbars">
      {rows.map((r) => {
        const isOpen = open === r.id
        // "Other" and "Unlabelled" are folds, not categories, so they have nothing inside.
        const expandable = !r.id.startsWith('__')
        const sections = isOpen && expandable ? sectionsOf(r.id) : []
        const pendingHere = pending && pending.bucket === r.id ? pending.amount : 0

        return (
          <div key={r.id} className={cx('catbar', isOpen && 'open')}>
            <button
              type="button"
              className="catbar-row"
              aria-expanded={expandable ? isOpen : undefined}
              onClick={() => expandable && setOpen(isOpen ? null : r.id)}
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
                  <ul className="catbar-sections">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <span className="n">{s.label}</span>
                        <span className="bar">
                          <span
                            className={'fill t-' + (r.tone || 'sky')}
                            style={{ width: Math.max(4, (s.amount / (sections[0].amount || 1)) * 100) + '%' }}
                          />
                        </span>
                        <span className="a">{F(s.amount)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Nothing recorded in a section here yet.</p>
                )}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
