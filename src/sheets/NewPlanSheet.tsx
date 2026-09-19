import { useState } from 'react'
import { BottomSheet, Button, FilterChips, TextField } from '../ui'
import type { Plan, PlanSection } from '../data/types'

interface Props {
  onClose: () => void
  onAdd: (p: Plan) => void
}

/**
 * New plan, with the first-time Scheduled / To-be-decided choice.
 * The amount is a note to the student and is never counted (CLAUDE.md §2.4).
 */
export function NewPlanSheet({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({ title: '', when: '', amount: '', notes: '', section: '' })
  const valid = !!form.title.trim() && !!form.section

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  return (
    <div className="sheet-host">
      <BottomSheet
        open
        onClose={onClose}
        pill="New plan"
        title={form.title || 'What’s coming up?'}
        subtitle="A reminder for yourself — never counted in any total"
        footer={
          <>
            <Button
              full
              disabled={!valid}
              onClick={() =>
                onAdd({
                  id: 'p' + Date.now(),
                  section: form.section as PlanSection,
                  title: form.title.trim(),
                  when: form.when,
                  amount: form.amount,
                  notes: form.notes,
                  done: false,
                })
              }
            >
              Add plan
            </Button>
            {!form.section ? <p className="sheet-hint">Pick scheduled or TBD to add it.</p> : null}
          </>
        }
      >
        <TextField
          id="np-title"
          label="What is it?"
          value={form.title}
          placeholder={'e.g. Vartika’s birthday'}
          onChange={(v) => set('title', v)}
        />
        <TextField
          id="np-when"
          label="When"
          value={form.when}
          placeholder={'e.g. 25 Sep, or “sometime in October”'}
          onChange={(v) => set('when', v)}
        />
        <TextField
          id="np-amount"
          label="Amount you have in mind"
          prefix={'₹'}
          value={form.amount}
          placeholder="e.g. 1,500"
          hint="Just for you. Plans are never counted in any total, projection or chart."
          onChange={(v) => set('amount', v.replace(/[^\d,]/g, ''))}
        />
        <TextField
          id="np-notes"
          label="Notes"
          multiline
          value={form.notes}
          placeholder={'Who’s going, what to book, a rough idea of cost…'}
          onChange={(v) => set('notes', v)}
        />

        <div className="sm-field">
          <span className="l">Where does it go?</span>
          <FilterChips
            single
            label="Where does it go?"
            value={form.section ? [form.section] : []}
            onChange={(v) => set('section', v[0] || '')}
            options={[
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'tbd', label: 'TBD' },
            ]}
          />
          <p className="hint-s">Scheduled is decided. TBD is still a maybe. You can drag it across later.</p>
        </div>
      </BottomSheet>
    </div>
  )
}
