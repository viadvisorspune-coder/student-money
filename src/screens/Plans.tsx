import { useState } from 'react'
import { Button, PlanItem, SectionHeader, TextField } from '../ui'
import { cx } from '../lib/cx'
import { F } from '../lib/format'
import { Swipeable } from '../components/Swipeable'
import { NewPlanSheet } from '../sheets/NewPlanSheet'
import { useApp } from '../state/AppContext'
import type { PlanSection } from '../data/types'

/**
 * Plans. Qualitative cues, Scheduled vs To be decided, swipe or drag to move.
 *
 * A plan may carry an amount the student typed and it is shown back to them, but it
 * is never added to, subtracted from or counted in any total, projection, chart or
 * insight (CLAUDE.md §2.4). Nothing on this screen feeds `selectors.ts`.
 */
export function Plans() {
  const app = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [drag, setDrag] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)

  function renderSection(key: PlanSection, title: string) {
    const items = app.plans.filter((x) => x.section === key)

    return (
      <div
        className={cx('plan-sec', over === key && !items.length && 'drop')}
        onDragOver={(e) => {
          if (drag) {
            e.preventDefault()
            setOver(key)
          }
        }}
        onDrop={(e) => {
          e.preventDefault()
          if (drag) app.movePlan(drag, key)
          setDrag(null)
          setOver(null)
        }}
      >
        <SectionHeader title={`${title} · ${items.length}`} />
        {items.length ? null : <p className="drop-hint">Drag a plan here</p>}

        {items.map((it) => {
          const isOpen = open === it.id
          return (
            <Swipeable
              key={it.id}
              disabled={isOpen}
              side={key === 'tbd' ? 'right' : 'left'}
              label={key === 'tbd' ? 'Move to scheduled' : 'Move to TBD'}
              onSwipe={() => {
                const to: PlanSection = key === 'tbd' ? 'scheduled' : 'tbd'
                app.movePlan(it.id, to)
                app.say(
                  `“${it.title || 'Untitled plan'}” moved to ${to === 'scheduled' ? 'Scheduled' : 'TBD'}.`,
                  () => app.movePlan(it.id, key),
                )
              }}
            >
              <PlanItem
                title={it.title || 'Untitled plan'}
                meta={
                  isOpen
                    ? null
                    : [
                        it.when,
                        // Shown back to the student. Never counted anywhere.
                        it.amount ? F(+String(it.amount).replace(/,/g, '') || 0) + ' in mind' : null,
                        it.notes,
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'Add more details…'
                }
                done={it.done}
                expanded={isOpen}
                onToggle={() => app.updatePlan(it.id, { done: !it.done })}
                onExpand={() => setOpen(isOpen ? null : it.id)}
                draggable
                dragging={drag === it.id}
                onDragStart={(e) => {
                  setDrag(it.id)
                  e.dataTransfer.effectAllowed = 'move'
                  try {
                    e.dataTransfer.setData('text/plain', it.id)
                  } catch {
                    /* some browsers refuse setData outside a user gesture */
                  }
                }}
                onDragEnd={() => {
                  setDrag(null)
                  setOver(null)
                }}
                onDragOver={(e) => {
                  if (drag && drag !== it.id) {
                    e.preventDefault()
                    e.stopPropagation()
                    setOver(it.id)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (drag && drag !== it.id) app.movePlan(drag, key, it.id)
                  setDrag(null)
                  setOver(null)
                }}
              >
                <TextField
                  id={'plan-title-' + it.id}
                  label="What is it?"
                  value={it.title}
                  placeholder={'e.g. Vartika’s birthday'}
                  onChange={(v) => app.updatePlan(it.id, { title: v })}
                />
                <TextField
                  id={'plan-when-' + it.id}
                  label="When"
                  value={it.when}
                  placeholder={'e.g. 25 Sep, or “sometime in October”'}
                  onChange={(v) => app.updatePlan(it.id, { when: v })}
                />
                <TextField
                  id={'plan-amount-' + it.id}
                  label="Amount you have in mind"
                  prefix={'₹'}
                  value={it.amount}
                  placeholder="e.g. 1,500"
                  hint="Just for you. Plans are never counted in any total, projection or chart."
                  onChange={(v) => app.updatePlan(it.id, { amount: v.replace(/[^\d,]/g, '') })}
                />
                <TextField
                  id={'plan-notes-' + it.id}
                  label="Notes"
                  multiline
                  value={it.notes}
                  placeholder={'Who’s going, what to book, a rough idea of cost…'}
                  onChange={(v) => app.updatePlan(it.id, { notes: v })}
                />
                <div className="row-btns">
                  <Button
                    variant="danger"
                    size="sm"
                    icon="trash"
                    onClick={() => {
                      app.removePlan(it.id)
                      setOpen(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </PlanItem>
            </Swipeable>
          )
        })}
      </div>
    )
  }

  return (
    <div className="stack">
      <section className="sm-appbar">
        <p className="sm-eyebrow" style={{ marginTop: 8 }}>
          Future / upcoming
        </p>
        <h1 className="sm-appbar-title">What&rsquo;s planned?</h1>
        <p className="plans-lede">
          Notes to yourself about what is coming. They show up as cues before you spend, and are never added to any
          total.
        </p>
      </section>

      <section className="sm-card surface plans">
        {renderSection('scheduled', 'Scheduled')}
        {renderSection('tbd', 'TBD')}
        <div style={{ marginTop: 16 }}>
          <Button full icon="plus" onClick={() => setIsNew(true)}>
            Make notes on upcoming expenses
          </Button>
        </div>
      </section>

      {isNew ? (
        <NewPlanSheet
          onClose={() => setIsNew(false)}
          onAdd={(p) => {
            app.addPlan(p)
            setIsNew(false)
          }}
        />
      ) : null}
    </div>
  )
}
