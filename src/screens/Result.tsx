import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppBar, Button, CueRow, ResultHeadline, SectionHeader } from '../ui'
import { F } from '../lib/format'
import { DAYS_IN_MONTH, TODAY } from '../lib/calendar'
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

  const after = app.free - d.amount
  const bk = d.bucket ? app.bmap[d.bucket] : undefined
  const bucketAfter = (bk ? app.spentBy[bk.id] || 0 : 0) + d.amount
  const daysLeft = DAYS_IN_MONTH - TODAY

  const insight = bk
    ? `${bk.name} would come to ${F(bucketAfter)} this month — ${Math.round(
        (bucketAfter / (app.spent + d.amount || 1)) * 100,
      )}% of everything you have spent, with ${daysLeft} days to go.`
    : `This would be ${Math.round((d.amount / (app.free || 1)) * 100)}% of what is free to spend, with ${daysLeft} days to go.`

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

      <ResultHeadline
        before={F(app.free)}
        after={F(after)}
        caption="free to spend for the rest of September"
        insight={insight}
      >
        <div className="drop">
          <div className="drop-bar" role="img" aria-label={`${F(d.amount)} of ${F(app.free)} free to spend`}>
            <span className="keep" style={{ flexGrow: Math.max(0, after) }} />
            <span className="gone" style={{ flexGrow: Math.max(1, d.amount) }} />
          </div>
          <div className="drop-key">
            <span>
              <i className="k keep" />
              {`Left after this · ${F(after)}`}
            </span>
            <span>
              <i className="k gone" />
              {`This spend · ${F(d.amount)}`}
            </span>
          </div>
        </div>
      </ResultHeadline>

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
              <CueRow key={p.id} title={p.title} when={p.when} note={p.notes || null} />
            ))}
          </div>
          <p className="fine">Plans are only reminders. Nothing here is counted in any total.</p>
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
