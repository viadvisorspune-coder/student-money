import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppBar, Button, CueRow, SectionHeader } from '../ui'
import { F } from '../lib/format'
import { setAside } from '../lib/plan'
import { AllowanceBar } from '../components/AllowanceBar'
import { CategoryBars } from '../components/CategoryBars'
import { useApp } from '../state/AppContext'

/**
 * Here's the picture.
 *
 * The allowance bar at the top animates from where the month stands to where it would
 * stand, counting as it goes, so the student watches the spend land. Below it, what
 * that does to the rest of the month, then the category shares — each one opening to
 * the sections inside it.
 *
 * Nothing here is written anywhere: the flow is a simulation (CLAUDE.md §2.5). The
 * insight is contextual, never a comparison with anyone (§2.2) and never advice (§2.3).
 */
export function Result() {
  const app = useApp()
  const navigate = useNavigate()

  // Snapshot the check on arrival, so clearing it on the way out cannot pull the
  // screen out from under the student.
  const [d] = useState(app.decision)

  if (!d) return <Navigate to="/" replace />

  const split = app.splits(d.amount, d.bucket)

  return (
    <div className="stack">
      <AppBar
        eyebrow={`If you spend ${F(d.amount)} on ${d.label}`}
        title={'Here’s the picture'}
        onBack={() => navigate('/')}
        backLabel="Change the amount"
      />

      {/* The spend landing, rather than a sentence about it landing. */}
      <AllowanceBar allowance={app.income} spent={app.spent} pending={d.amount} animate />

      <SectionHeader onCanvas title="Where it would stand" />
      <section className="sm-card surface">
        <CategoryBars
          rows={split}
          buckets={app.buckets}
          txns={app.txns}
          pending={{ bucket: d.bucket, amount: d.amount }}
        />
        <p className="hint">Tap a category to see the sections inside it.</p>
      </section>

      {app.cues.length ? (
        <>
          <SectionHeader onCanvas title="Coming up" />
          <div className="cues">
            {app.cues.slice(0, 3).map((p) => (
              <CueRow
                key={p.id}
                title={p.title}
                when={p.when}
                amount={setAside(p.amount)}
                note={p.notes || null}
              />
            ))}
          </div>
          <p className="fine">
            Plans are only reminders, and what you have set aside for them is a note to yourself. Nothing here is
            counted in any total.
          </p>
        </>
      ) : null}

      <div className="exits">
        <Button
          full
          onClick={() => {
            app.setDecision(null)
            navigate('/')
          }}
        >
          Noted
        </Button>
      </div>
    </div>
  )
}
