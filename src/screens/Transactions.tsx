import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, BottomSheet, Button, FilterChips, HighlightCard, Icon, IconButton, TransactionRow } from '../ui'
import { F } from '../lib/format'
import { dayLabel, t12 } from '../lib/calendar'
import { SetAside } from '../components/SetAside'
import { FREQUENT_VENDOR_MIN_COUNT } from '../data/assumptions'
import { useApp } from '../state/AppContext'
import type { Txn } from '../data/types'

/**
 * Transactions. Every row leads with what the payment was for, read from the
 * remark — not the vendor (CLAUDE.md §2.7). Red and green appear on the amounts
 * and nowhere else (§2.8).
 */
export function Transactions() {
  const app = useApp()
  const navigate = useNavigate()
  const [dir, setDir] = useState<string[]>(['in', 'out'])
  const [bsel, setBsel] = useState<string[]>([])
  const [sheet, setSheet] = useState(false)

  const list = app.txns.filter(
    (t) =>
      (t.income ? dir.indexOf('in') > -1 : dir.indexOf('out') > -1) &&
      (!bsel.length || bsel.indexOf(t.income ? 'income' : t.bucket || 'none') > -1),
  )

  const days: Record<number, Txn[]> = {}
  list.forEach((t) => {
    ;(days[t.day] = days[t.day] || []).push(t)
  })
  const order = Object.keys(days).map(Number).sort((a, b) => b - a)

  const nIn = app.txns.filter((t) => t.income).length
  const unlabelled = app.txns.filter((t) => !t.income && !t.bucket)

  const counts: Record<string, number> = {}
  app.txns.forEach((t) => {
    if (!t.income) counts[t.vendor] = (counts[t.vendor] || 0) + 1
  })
  const freq = Object.keys(counts).filter((v) => counts[v] >= FREQUENT_VENDOR_MIN_COUNT)[0]

  const bucketOptions = app.buckets
    .map((bk) => ({ value: bk.id, label: bk.name }))
    .concat([{ value: 'none', label: 'Needs a label' }])

  return (
    <div className="stack">
      <AppBar
        eyebrow="September 2026"
        title="What it was for"
        onBack={() => navigate(-1)}
        trailing={
          <IconButton
            icon="filter"
            variant={bsel.length ? 'dark' : 'soft'}
            label="Filter by category"
            onClick={() => setSheet(true)}
          />
        }
      >
        <div style={{ marginTop: 16 }}>
          <FilterChips
            label="Direction"
            value={dir}
            onChange={setDir}
            options={[
              { value: 'in', label: 'Incoming', count: nIn },
              { value: 'out', label: 'Outgoing', count: app.txns.length - nIn },
            ]}
          />
        </div>
        <p className="appbar-note">
          Read from the payment remark, not the vendor name. You can rewrite any of them.
        </p>
      </AppBar>

      {freq ? (
        <HighlightCard
          tone="sunflower"
          title={`You paid ${freq} ${counts[freq]} times this month`}
          subtitle="Want to file it under a section?"
          action={
            <IconButton
              icon="arrow-up-right"
              variant="dark"
              size="lg"
              label={'File ' + freq}
              onClick={() => {
                const t = app.txns.filter((x) => x.vendor === freq)[0]
                app.setLabelPrompt({ vendor: freq, bucket: t.bucket, count: counts[freq] })
              }}
            />
          }
        />
      ) : null}

      {unlabelled.length ? (
        <HighlightCard
          tone="butter"
          title={
            unlabelled.length === 1 ? 'One payment needs a label' : `${unlabelled.length} payments need a label`
          }
          subtitle="The app could not tell what they were for"
          action={
            <IconButton
              icon="arrow-up-right"
              variant="dark"
              size="lg"
              label="Label the first one"
              onClick={() => app.setOpenTxn(unlabelled[0].id)}
            />
          }
        />
      ) : null}

      {bsel.length ? (
        <div className="active-filters">
          {bsel.map((id) => {
            const name = id === 'none' ? 'Needs a label' : app.bmap[id] ? app.bmap[id].name : id
            return (
              <button
                key={id}
                type="button"
                className="sm-chip light"
                onClick={() => setBsel(bsel.filter((x) => x !== id))}
              >
                {name}
                <Icon name="close" size={14} />
              </button>
            )
          })}
        </div>
      ) : null}

      <section className="sm-card surface list">
        {order.length ? (
          order.map((d) => {
            const sum = days[d].reduce((a, t) => a + t.amount, 0)
            return (
              <div key={d} className="day">
                <div className="day-h">
                  <span>{dayLabel(d)}</span>
                  <span>{F(sum, { sign: true })}</span>
                </div>
                {days[d]
                  .slice()
                  .sort((a, b) => (a.time < b.time ? 1 : -1))
                  .map((t) => {
                    const bk = app.resolve(t)
                    return (
                      <TransactionRow
                        key={t.id}
                        vendor={t.forLabel || 'Unknown payment'}
                        bucket={
                          bk.unlabelled
                            ? 'Tap to say what it was for'
                            : `${t.vendor} · ${bk.outletName || bk.name}`
                        }
                        time={t12(t.time)}
                        amount={t.amount}
                        icon={bk.icon}
                        tone={bk.color}
                        onClick={() => app.setOpenTxn(t.id)}
                      />
                    )
                  })}
              </div>
            )
          })
        ) : app.txns.length === 0 ? (
          // Nothing recorded at all. Offering to clear filters would be nonsense here.
          <div className="empty">
            <p>No payments yet. Anything you add by hand will show up here.</p>
            <Button variant="soft" icon="plus" onClick={() => app.setAdd(true)}>
              Add your first payment
            </Button>
          </div>
        ) : (
          <div className="empty">
            <p>No transactions match these filters.</p>
            <Button
              variant="soft"
              onClick={() => {
                setDir(['in', 'out'])
                setBsel([])
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>

      {/* Money already promised to something coming up, where the student is looking
          at what has gone. Shown beside the payments, never mixed into them. */}
      <SetAside title="Set aside for what is coming" />

      <div className="sticky-add">
        <Button full icon="plus" onClick={() => app.setAdd(true)}>
          Add a payment by hand
        </Button>
      </div>

      {sheet ? (
        <div className="sheet-host">
          <BottomSheet
            open
            onClose={() => setSheet(false)}
            pill="Filter"
            title="Show categories"
            subtitle="Pick one or more"
            footer={
              <Button full onClick={() => setSheet(false)}>
                {`Show ${list.length} transactions`}
              </Button>
            }
          >
            <FilterChips
              label="Categories"
              value={bsel}
              onChange={setBsel}
              options={[{ value: 'income', label: 'Income' }].concat(bucketOptions)}
            />
            {bsel.length ? (
              <Button variant="soft" onClick={() => setBsel([])}>
                Clear filter
              </Button>
            ) : null}
          </BottomSheet>
        </div>
      ) : null}
    </div>
  )
}
