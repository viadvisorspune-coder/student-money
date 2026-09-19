import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppBar, Button, CueRow, ProjectionCard, ResultHeadline, SectionHeader } from '../ui'
import { F } from '../lib/format'
import { DAYS_IN_MONTH, TODAY } from '../lib/calendar'
import { useApp } from '../state/AppContext'

/**
 * Here's the picture. Before/after free-to-spend, the projection with its splits,
 * recent payments in the selected category, cues, and one exit.
 *
 * Nothing on this screen is written anywhere: the flow is a simulation of the rest
 * of the month (CLAUDE.md §2.5). The insight is contextual — what this spend does
 * to this month — and never compares Parisha with anyone (§2.2), nor advises (§2.3).
 */
export function Result() {
  const app = useApp()
  const navigate = useNavigate()
  const d = app.decision
  const [sel, setSel] = useState<string | null>(d?.bucket ?? null)

  // Reached without a decision (a refresh, or a deep link): send the student back.
  if (!d) return <Navigate to="/estimate" replace />

  const after = app.free - d.amount
  const bk = d.bucket ? app.bmap[d.bucket] : undefined
  const bucketSpent = bk ? app.spentBy[bk.id] || 0 : 0
  const bucketAfter = bucketSpent + d.amount
  const daysLeft = DAYS_IN_MONTH - TODAY

  const insight = bk
    ? `${bk.name} would come to ${F(bucketAfter)} this month — ${Math.round(
        (bucketAfter / (app.spent + d.amount || 1)) * 100,
      )}% of everything you have spent, with ${daysLeft} days to go.`
    : `This would be ${Math.round((d.amount / (app.free || 1)) * 100)}% of what is free to spend, with ${daysLeft} days to go.`

  const split = app.splits(d.amount, d.bucket)
  const selItem = split.filter((x) => x.id === sel)[0]

  const recent = app.txns
    .filter((t) => !t.income && (sel ? (sel === '__other' ? true : t.bucket === sel) : true))
    .slice()
    .sort((a, b) => b.day - a.day)
    .slice(0, 4)

  return (
    <div className="stack">
      <AppBar
        eyebrow={`If you spend ${F(d.amount)} on ${d.label}`}
        title={'Here’s the picture'}
        onBack={() => navigate('/estimate')}
        backLabel="Change the amount"
      />

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

      <ProjectionCard
        eyebrow="This month"
        value={F(app.projection(d.amount))}
        caption={`projected for September if you spend this and the rest of the month goes like the last ${TODAY} days`}
        selected={sel}
        onSelect={setSel}
        onExpand={() => navigate('/spend')}
        expandLabel="See where it went"
        splits={split}
      >
        {selItem ? (
          <div className="proj-recent">
            <p className="sm-eyebrow">{'Recent in ' + selItem.label}</p>
            {recent.map((t) => (
              <p key={t.id} className="r">
                <span>{t.vendor}</span>
                <span>{F(t.amount)}</span>
              </p>
            ))}
            <button type="button" className="viewall" onClick={() => navigate('/profile/transactions')}>
              View all
            </button>
          </div>
        ) : null}
      </ProjectionCard>

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
