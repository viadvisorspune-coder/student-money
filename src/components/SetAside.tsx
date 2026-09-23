import { useNavigate } from 'react-router-dom'
import { CueRow, SectionHeader } from '../ui'
import { planAmount, setAside } from '../lib/plan'
import { useApp } from '../state/AppContext'

/**
 * What the student has put aside in their head, wherever they are looking at spending.
 *
 * Every plan that carries a figure is listed with it, so the ₹1,500 meant for Vartika's
 * birthday sits beside the month's real spending instead of being remembered separately.
 *
 * It is listed, not counted: no figure here is added to the spend, taken off what is
 * free, or fed into a projection or a chart (CLAUDE.md §2.4). There is deliberately no
 * total at the bottom of this section, because a total is the thing the brief forbids.
 */
export function SetAside({ title = 'Set aside this month' }: { title?: string }) {
  const app = useApp()
  const navigate = useNavigate()

  // Scheduled first, then the ones still to be decided — the order they are lived in.
  const items = app.cues
    .filter((p) => planAmount(p.amount))
    .slice()
    .sort((a, b) => (a.section === b.section ? 0 : a.section === 'scheduled' ? -1 : 1))

  if (!items.length) return null

  return (
    <>
      <SectionHeader onCanvas title={title} />
      <div className="cues">
        {items.map((p) => (
          <CueRow
            key={p.id}
            title={p.title || 'Untitled plan'}
            when={p.when || (p.section === 'scheduled' ? 'Scheduled' : 'Not decided yet')}
            amount={setAside(p.amount)}
            note={p.notes || null}
            onClick={() => navigate('/plans')}
          />
        ))}
      </div>
      <p className="fine">
        Amounts you have in mind for what is coming. They are yours to see and nothing more &mdash; none of them is
        counted in the figures above.
      </p>
    </>
  )
}
