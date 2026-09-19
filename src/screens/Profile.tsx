import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarStack, BarList, IconButton, InsightCard, LinkRow, SectionHeader } from '../ui'
import { F } from '../lib/format'
import { TODAY } from '../lib/calendar'
import { DataSheet } from '../sheets/DataSheet'
import { useApp } from '../state/AppContext'

/**
 * Profile. Balance, history, spending analysis, Patterns, and "What the app uses".
 * That last section is required and must stay (CLAUDE.md §2.9): it is what tells the
 * student what is read and how to edit or clear it.
 */
export function Profile() {
  const app = useApp()
  const navigate = useNavigate()
  const [dataOpen, setDataOpen] = useState(false)

  const unlabelled = app.txns.filter((t) => !t.income && !t.bucket)
  const total = app.spent || 1

  const rows = app.buckets
    .map((bk) => {
      const v = app.spentBy[bk.id] || 0
      return {
        id: bk.id,
        label: bk.name,
        value: v,
        tone: bk.color,
        display: `${F(v)} · ${Math.round((v / total) * 100)}%`,
      }
    })
    .sort((a, b) => b.value - a.value)

  return (
    <div className="stack">
      <section className="sm-card soft">
        <div className="prof-top">
          <AvatarStack size="lg" people={[{ initials: 'PA', tone: 'butter', name: 'Parisha' }]} />
          <div>
            <p className="sm-eyebrow">Your profile</p>
            <h1 className="prof-name">Parisha</h1>
          </div>
        </div>
        <p className="bal">{F(app.balance, { decimals: 2 })}</p>
        <p className="bal-c">Money in your account</p>
      </section>

      <LinkRow
        tone="surface"
        title="See transaction history"
        caption={
          `${app.txns.length} transactions this month` +
          (unlabelled.length
            ? ` · ${unlabelled.length}${unlabelled.length === 1 ? ' needs' : ' need'} a label`
            : '')
        }
        onClick={() => navigate('/profile/transactions')}
      />

      <SectionHeader onCanvas title="Your spending analysis" />

      <section className="sm-projection">
        <div className="head">
          <p className="sm-eyebrow">Where it went this month</p>
          <IconButton
            icon="arrow-up-right"
            variant="light"
            size="sm"
            label="Open Experience"
            onClick={() => navigate('/profile/experience')}
          />
        </div>
        <BarList
          onDark
          items={rows}
          onSelect={(id) => {
            if (id) navigate('/profile/experience')
          }}
        />
        <p className="proj-detail">
          {`${F(app.spent)} spent across ${rows.filter((r) => r.value > 0).length} categories`}
        </p>
      </section>

      <SectionHeader onCanvas title="Patterns" />

      <div className="insights">
        {app.skipped.length ? (
          <button type="button" className="insight-btn" onClick={() => app.setInfo('skipped')}>
            <InsightCard kind="You vs yourself" tone="sky" detail={'Tap to see what “skipped” means.'}>
              {`You checked and then skipped ${F(
                app.skipped.reduce((a, x) => a + x.amount, 0),
              )} across ${app.skipped.length}${app.skipped.length === 1 ? ' decision' : ' decisions'} this month.`}
            </InsightCard>
          </button>
        ) : null}

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

      {/* Footnotes state the basis of a number, never a verdict (CLAUDE.md §7). */}
      <p className="fine">{`Worked out from your transactions up to today, ${TODAY} September.`}</p>
      <p className="fine">
        Patterns compare you with your own history only. The app never compares you with other students and never
        tells you what to do.
      </p>

      <SectionHeader onCanvas title="What the app uses" />

      <LinkRow
        tone="surface"
        title="Labels and categories"
        caption="You decide what each payment was for"
        onClick={() => {
          app.setDecision(null)
          navigate('/spend')
        }}
      />
      <LinkRow
        tone="butter"
        title="Data the app reads"
        caption={'Payment remarks and amounts · edit or clear any of it'}
        onClick={() => navigate('/profile/transactions')}
      />
      {/* The brief requires a way to clear what is held (§2.9); the approved design
          has no control for it, so this row is an addition and needs sign-off. */}
      <LinkRow
        tone="surface"
        title="What is stored on this phone"
        caption={`${app.txns.length} payments \u00b7 ${app.buckets.length} categories \u00b7 ${app.plans.length} plans`}
        onClick={() => setDataOpen(true)}
      />

      <DataSheet open={dataOpen} onClose={() => setDataOpen(false)} />
    </div>
  )
}
