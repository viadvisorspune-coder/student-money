import { useState } from 'react'
import { BottomSheet, Button, FilterChips, Icon, TextField } from '../ui'
import { cx } from '../lib/cx'
import { F } from '../lib/format'
import { dayLabel, t12 } from '../lib/calendar'
import type { Bucket, ResolvedBucket, Txn } from '../data/types'

interface Props {
  txn?: Txn
  buckets: Bucket[]
  resolve: (t: Txn) => ResolvedBucket
  onClose: () => void
  onSave: (t: Txn) => void
}

/**
 * Transaction detail. The question asked is "For?", not who it was paid to
 * (CLAUDE.md §2.7), and the student can rewrite the remark in their own words.
 */
export function TxnSheet({ txn, buckets, resolve, onClose, onSave }: Props) {
  const [form, setForm] = useState(() =>
    txn
      ? { bucket: txn.bucket, outlet: txn.outlet, forLabel: txn.forLabel, note: txn.note, frequent: txn.frequent }
      : null,
  )

  if (!txn || !form) return null

  const resolved = resolve({ ...txn, bucket: form.bucket, outlet: form.outlet })
  const current = buckets.filter((b) => b.id === form.bucket)[0]
  const placeName = resolved.outletName || resolved.name

  return (
    <div className="sheet-host">
      <BottomSheet
        open
        onClose={onClose}
        pill={dayLabel(txn.day) + ' · ' + t12(txn.time)}
        title={form.forLabel || 'What was this for?'}
        subtitle={txn.vendor + (txn.income ? ' · received' : ' · paid via UPI')}
        footer={
          <Button full onClick={() => onSave({ ...txn, ...form })}>
            Save changes
          </Button>
        }
      >
        <div className={cx('txn-amt', txn.income && 'pos')}>{F(txn.amount, { sign: true, decimals: 2 })}</div>

        <TextField
          id="txn-for"
          label="For?"
          value={form.forLabel}
          placeholder="e.g. dinner with Riya"
          hint={
            txn.forLabel
              ? 'Taken from the payment remark. Rewrite it in your own words.'
              : 'The app could not read a remark for this one. Say what it was for.'
          }
          onChange={(v) => setForm({ ...form, forLabel: v })}
        />

        {txn.income || !txn.bucket ? null : (
          <p className="auto-note">
            <Icon name="check" size={14} />
            {`Filed under ${placeName} automatically, because you pay ${txn.vendor} often. Change it below and it stays changed.`}
          </p>
        )}

        {txn.income ? null : (
          <div className="sm-field">
            <span className="l">Category</span>
            <FilterChips
              single
              label="Category"
              value={form.bucket ? [form.bucket] : []}
              onChange={(v) => setForm({ ...form, bucket: v[0] || null, outlet: null })}
              options={buckets.map((b) => ({ value: b.id, label: b.name }))}
            />
          </div>
        )}

        {txn.income || !current ? null : (
          <div className="sm-field">
            <span className="l">Section</span>
            <FilterChips
              single
              label="Section"
              value={[form.outlet || resolved.outletId || '']}
              onChange={(v) => setForm({ ...form, outlet: v[0] || null })}
              options={current.outlets.map((o) => ({ value: o.id, label: o.name }))}
            />
          </div>
        )}

        {txn.income ? null : (
          <div className="sm-field">
            <span className="l">Frequent payment</span>
            <FilterChips
              label="Frequent payment"
              value={form.frequent ? ['f'] : []}
              onChange={(v) => setForm({ ...form, frequent: v.length > 0 })}
              options={[{ value: 'f', label: 'I pay ' + txn.vendor + ' often' }]}
            />
            <p className="hint-s">{`Frequent vendors are filed under ${placeName} automatically.`}</p>
          </div>
        )}

        <TextField
          id="txn-note"
          label="Note"
          multiline
          value={form.note}
          placeholder="Anything worth remembering"
          onChange={(v) => setForm({ ...form, note: v })}
        />
      </BottomSheet>
    </div>
  )
}
