import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, SectionHeader } from '../ui'
import { cx } from '../lib/cx'
import { F } from '../lib/format'
import { DecideForm } from '../components/DecideForm'
import { useApp } from '../state/AppContext'

/** The amount a plan carries is a string the student typed; read it only to prefill. */
function planAmount(raw: string): string {
  return String(raw).replace(/[^\d]/g, '')
}

/**
 * Write an estimate for something coming up.
 *
 * Reached from Plans, where the student has already noted what is ahead. Picking one
 * fills the form from it, so a plan they wrote weeks ago can be checked in a tap.
 *
 * Choosing a plan here does not make it money. Its amount is copied into the form as a
 * starting figure and nothing else — the plan itself stays a cue, and no total,
 * projection or chart reads it (CLAUDE.md §2.4). The check that follows records
 * nothing either (§2.5).
 */
export function WriteEstimate() {
  const app = useApp()
  const navigate = useNavigate()
  const [picked, setPicked] = useState<string | null>(null)

  const plan = picked ? app.plans.filter((p) => p.id === picked)[0] : undefined
  const withAmount = app.cues.filter((p) => planAmount(p.amount))

  return (
    <div className="stack">
      <AppBar
        eyebrow="Upcoming expense"
        title="Write an estimate"
        onBack={() => navigate('/plans')}
        backLabel="Back to plans"
      />

      {app.cues.length ? (
        <>
          <SectionHeader onCanvas title="Start from a plan" />
          <div className="plan-picks" role="group" aria-label="Start from a plan">
            {app.cues.map((p) => {
              const amt = planAmount(p.amount)
              const on = picked === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  className={cx('plan-pick', on && 'on')}
                  aria-pressed={on}
                  onClick={() => setPicked(on ? null : p.id)}
                >
                  <span className="t">{p.title || 'Untitled plan'}</span>
                  <span className="m">
                    {[p.when, amt ? `${F(+amt)} in mind` : null].filter(Boolean).join(' · ') || 'No details yet'}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="fine">
            {withAmount.length
              ? 'Picking one fills the amount you had in mind. You can change it before checking.'
              : 'Picking one fills in what it is for. None of them has an amount written yet.'}
          </p>
        </>
      ) : null}

      <SectionHeader onCanvas title={plan ? `Estimate for ${plan.title}` : 'Or write it fresh'} />

      <section className="sm-card surface decide">
        <DecideForm
          // Remount when the pick changes, so the fields take the new starting values.
          key={picked || 'fresh'}
          initialAmount={plan ? planAmount(plan.amount) : ''}
          initialFor={plan ? plan.title : ''}
          submitLabel="Check this estimate"
          onSubmit={(d) => {
            app.setDecision(d)
            navigate('/result')
          }}
        />
      </section>

      <p className="fine">
        Nothing is recorded here, and nothing is taken off any plan. This only shows what the spend would do to the
        rest of your month.
      </p>
    </div>
  )
}
