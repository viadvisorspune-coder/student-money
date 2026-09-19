import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, BarChart, BucketBreakdown, Icon, SegmentedToggle, TransactionRow } from '../ui'
import { F } from '../lib/format'
import { TODAY, dayLabel, wd } from '../lib/calendar'
import { useApp } from '../state/AppContext'
import type { Tone } from '../ui/types'

/** August's total, held here because the demo data only covers September. */
const PREVIOUS_MONTH_TOTAL = 7650

interface Bar {
  id: string
  label: string
  value: number
  display: string
  days: number[]
}

/**
 * Experience. Past spending as bars, compared against the student's own previous
 * period — never against other students or an average (CLAUDE.md §2.2). The
 * comparison chip states the difference and stops there (§2.3).
 */
export function Experience() {
  const app = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'week' | 'month'>('week')
  const [sel, setSel] = useState<string | null>(null)

  const out = app.txns.filter((t) => !t.income)
  const sumOf = (list: typeof out) => -list.reduce((a, t) => a + t.amount, 0)

  let bars: Bar[]
  let prevTotal: number
  let prevLabel: string
  let range: string

  if (mode === 'week') {
    bars = []
    for (let d = TODAY - 6; d <= TODAY; d++) {
      const v = sumOf(out.filter((t) => t.day === d))
      bars.push({ id: 'd' + d, label: d === TODAY ? 'Today' : wd(d), value: v, display: F(v), days: [d] })
    }
    prevTotal = sumOf(out.filter((t) => t.day >= TODAY - 13 && t.day <= TODAY - 7))
    prevLabel = 'last week'
    range = TODAY - 6 + '–' + TODAY + ' Sep'
  } else {
    const weeks: [number, number, string][] = [
      [1, 7, '1–7'],
      [8, 14, '8–14'],
      [15, 21, '15–21'],
    ]
    bars = weeks.map((w) => {
      const v = sumOf(out.filter((t) => t.day >= w[0] && t.day <= w[1]))
      const days: number[] = []
      for (let i = w[0]; i <= w[1]; i++) days.push(i)
      return { id: 'w' + w[0], label: w[2] + ' Sep', value: v, display: F(v), days }
    })
    prevTotal = PREVIOUS_MONTH_TOTAL
    prevLabel = 'August'
    range = 'September so far'
  }

  const selBar = bars.filter((b) => b.id === sel)[0]
  const days = selBar ? selBar.days : bars.flatMap((b) => b.days)
  const inRange = out.filter((t) => days.indexOf(t.day) > -1)
  const total = sumOf(inRange)
  const periodTotal = bars.reduce((a, b) => a + b.value, 0)
  const diff = prevTotal ? Math.round(((periodTotal - prevTotal) / prevTotal) * 100) : 0

  const by: Record<string, number> = {}
  inRange.forEach((t) => {
    const k = t.bucket || 'none'
    by[k] = (by[k] || 0) - t.amount
  })
  const items = Object.keys(by)
    .map((k) => {
      const bk = app.bmap[k]
      return {
        id: k,
        name: bk ? bk.name : 'Needs a label',
        amount: by[k],
        tone: (bk ? bk.color : 'soft') as Tone,
      }
    })
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className="stack">
      <AppBar eyebrow={'Experience · past spending'} title="How your money moved" onBack={() => navigate(-1)}>
        <div style={{ marginTop: 16 }}>
          <SegmentedToggle
            label="Period"
            value={mode}
            onChange={(v) => {
              setMode(v as 'week' | 'month')
              setSel(null)
            }}
            options={[
              { value: 'week', label: 'Weekly' },
              { value: 'month', label: 'Monthly' },
            ]}
          />
        </div>
      </AppBar>

      <section className="sm-card surface">
        <p className="sm-eyebrow">
          {selBar ? (mode === 'week' ? dayLabel(+selBar.id.slice(1)) : selBar.label) : range}
        </p>

        <div className="exp-total">
          <span className="v">{F(total)}</span>
          <span className="l">spent</span>
        </div>

        {!selBar ? (
          <span className="sm-chip soft" style={{ marginTop: 8 }}>
            <Icon name={diff <= 0 ? 'arrow-down-right' : 'arrow-up-right'} size={16} />
            {(diff <= 0 ? Math.abs(diff) + '% less than ' : diff + '% more than ') +
              prevLabel +
              (mode === 'month' ? ' (so far)' : '')}
          </span>
        ) : (
          <button type="button" className="sm-chip soft clear" onClick={() => setSel(null)}>
            {'Show whole ' + (mode === 'week' ? 'week' : 'month')}
            <Icon name="close" size={14} />
          </button>
        )}

        <div style={{ marginTop: 20 }}>
          <BarChart
            bars={bars}
            selected={sel}
            onSelect={setSel}
            label={'Spending by ' + (mode === 'week' ? 'day' : 'week')}
          />
        </div>

        <p className="hint">{'Tap a bar to see that ' + (mode === 'week' ? 'day' : 'week') + '.'}</p>
      </section>

      {items.length ? (
        <section className="sm-card surface">
          <p className="sm-eyebrow">By category</p>
          <BucketBreakdown items={items} />
        </section>
      ) : null}

      <section className="sm-card surface list">
        <p className="sm-eyebrow" style={{ marginBottom: 4 }}>
          {inRange.length + ' transactions'}
        </p>
        {inRange.length ? (
          inRange
            .slice()
            .sort((a, b) => b.day - a.day || (a.time < b.time ? 1 : -1))
            .map((t) => {
              const bk = app.resolve(t)
              return (
                <TransactionRow
                  key={t.id}
                  vendor={t.forLabel || 'Unknown payment'}
                  bucket={t.vendor + (bk.outletName ? ' · ' + bk.outletName : '')}
                  time={dayLabel(t.day)}
                  amount={t.amount}
                  icon={bk.icon}
                  tone={bk.color}
                  onClick={() => app.setOpenTxn(t.id)}
                />
              )
            })
        ) : (
          <p className="muted">Nothing spent in this period.</p>
        )}
      </section>
    </div>
  )
}
