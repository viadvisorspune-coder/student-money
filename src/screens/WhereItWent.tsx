import { useNavigate } from 'react-router-dom'
import { AppBar, InsightCard, LinkRow, SectionHeader } from '../ui'
import { F } from '../lib/format'
import { AllowanceBar } from '../components/AllowanceBar'
import { CategoryBars } from '../components/CategoryBars'
import { useApp } from '../state/AppContext'

/**
 * Where it went. Spent against the month's allowance, anything still needing a label,
 * then the category shares — each opening to the nested breakdown of its sections.
 * The patterns repeat here because this is where the student is already looking at
 * their own month.
 */
export function WhereItWent() {
  const app = useApp()
  const navigate = useNavigate()

  const split = app.splits()

  return (
    <div className="stack">
      <AppBar eyebrow="September" title="Where it went" onBack={() => navigate(-1)} />

      <AllowanceBar allowance={app.income} spent={app.spent} />

      {/* Anything the app could not place comes first, so it is dealt with before
          the breakdowns that it is missing from. */}
      {app.spentBy.__none ? (
        <LinkRow
          tone="butter"
          title={`${F(app.spentBy.__none)} needs a label`}
          caption="Unknown payments the app could not place"
          onClick={() => navigate('/profile/transactions')}
        />
      ) : null}

      <SectionHeader onCanvas title="By category" />
      <section className="sm-card surface">
        <CategoryBars rows={split} buckets={app.buckets} txns={app.txns} />
        <p className="hint">{`Tap a category to open it. Projected for September: ${F(app.projection())}.`}</p>
      </section>

      <SectionHeader onCanvas title="Your patterns" />
      <div className="insights">
        {app.patterns.map((p, i) => (
          <button
            key={i}
            type="button"
            className="insight-btn"
            onClick={() => navigate('/profile/transactions')}
          >
            <InsightCard
              kind={p.kind}
              detail={(p.detail ? p.detail + ' ' : '') + 'Tap to see the payments behind it.'}
              tone={p.tone || 'soft'}
            >
              {p.text}
            </InsightCard>
          </button>
        ))}
      </div>
    </div>
  )
}
