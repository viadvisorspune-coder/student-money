import { useState } from 'react'
import { BottomSheet, Button, FilterChips, TextField } from '../ui'
import { TODAY } from '../lib/calendar'
import type { Bucket, Txn } from '../data/types'

interface Props {
  open: boolean
  buckets: Bucket[]
  onClose: () => void
  onAdd: (t: Txn) => void
}

/** Add a payment by hand — for cash, or anything the app did not catch. */
export function AddTxnSheet({ open, buckets, onClose, onAdd }: Props) {
  const [form, setForm] = useState({ amount: '', forLabel: '', vendor: '', bucket: '', outlet: '' })

  if (!open) return null

  const current = buckets.filter((b) => b.id === form.bucket)[0]
  const amount = +String(form.amount).replace(/[^\d]/g, '')
  const valid = amount > 0 && !!form.forLabel.trim()

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  return (
    <div className="sheet-host">
      <BottomSheet
        open
        onClose={onClose}
        pill="By hand"
        title="Add a payment"
        subtitle="For cash, or anything the app did not catch"
        footer={
          <Button
            full
            disabled={!valid}
            onClick={() =>
              onAdd({
                id: 't' + Date.now(),
                day: TODAY,
                time: '18:30',
                vendor: form.vendor.trim() || 'Cash',
                forLabel: form.forLabel.trim(),
                amount: -amount,
                bucket: form.bucket || null,
                income: false,
                outlet: form.outlet || null,
                note: '',
                frequent: false,
                social: false,
                planned: false,
              })
            }
          >
            Add payment
          </Button>
        }
      >
        <TextField
          id="at-amount"
          label="Amount"
          prefix={'₹'}
          inputMode="numeric"
          value={form.amount}
          placeholder="0"
          onChange={(v) => set('amount', v.replace(/[^\d,]/g, ''))}
        />
        <TextField
          id="at-for"
          label="For?"
          value={form.forLabel}
          placeholder="e.g. auto to college"
          onChange={(v) => set('forLabel', v)}
        />
        <TextField
          id="at-vendor"
          label="Paid to (optional)"
          value={form.vendor}
          placeholder="e.g. Chai tapri, or leave blank for cash"
          onChange={(v) => set('vendor', v)}
        />

        <div className="sm-field">
          <span className="l">Category</span>
          <FilterChips
            single
            label="Category"
            value={form.bucket ? [form.bucket] : []}
            onChange={(v) => setForm((f) => ({ ...f, bucket: v[0] || '', outlet: '' }))}
            options={buckets.map((b) => ({ value: b.id, label: b.name }))}
          />
        </div>

        {current ? (
          <div className="sm-field">
            <span className="l">Section</span>
            <FilterChips
              single
              label="Section"
              value={form.outlet ? [form.outlet] : []}
              onChange={(v) => set('outlet', v[0] || '')}
              options={current.outlets.map((o) => ({ value: o.id, label: o.name }))}
            />
          </div>
        ) : null}

        {/* No limit is checked here, because there is no limit anywhere (CLAUDE.md §2.1). */}
        <p className="hint-s">Nothing is checked against a limit — this only adds what you spent.</p>
      </BottomSheet>
    </div>
  )
}
