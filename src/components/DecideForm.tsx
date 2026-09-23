import { useMemo, useState } from 'react'
import { Button, Combobox, type ComboOption } from '../ui'
import { F } from '../lib/format'
import { QUICK_AMOUNTS } from '../data/assumptions'
import { useApp } from '../state/AppContext'

interface Props {
  /** Starting amount, e.g. the figure already written against a plan. */
  initialAmount?: string
  /** Starting "For?" text, e.g. a plan's title. */
  initialFor?: string
  submitLabel?: string
  onSubmit: (decision: { amount: number; label: string; bucket: string | null }) => void
}

/**
 * Write an estimate: an amount, and what it is for.
 *
 * Shared by Home and the Plans estimate screen so there is one implementation of the
 * check, not two that drift. Nothing here is recorded — it only builds the decision
 * the Result screen simulates (CLAUDE.md §2.5).
 */
export function DecideForm({ initialAmount = '', initialFor = '', submitLabel = 'Check', onSubmit }: Props) {
  const app = useApp()
  const [amountText, setAmountText] = useState(initialAmount)
  const [forText, setForText] = useState(initialFor)
  const [forOption, setForOption] = useState<ComboOption | undefined>()

  const amount = +String(amountText).replace(/[^\d]/g, '')

  /** Every section across every category, so the answer can be as specific as the spend. */
  const options = useMemo<ComboOption[]>(
    () =>
      app.buckets.flatMap((b) =>
        b.outlets.map((o) => ({ value: `${b.id}:${o.id}`, label: o.name, group: b.name })),
      ),
    [app.buckets],
  )

  /**
   * A picked section carries its category. Typed text is matched against the section
   * and category names; matching nothing is fine — the check then runs against the
   * month as a whole rather than one category.
   */
  function resolveBucket(): string | null {
    if (forOption) return forOption.value.split(':')[0]
    const typed = forText.trim().toLowerCase()
    if (!typed) return null
    const bySection = options.filter((o) => o.label.toLowerCase() === typed)[0]
    if (bySection) return bySection.value.split(':')[0]
    const byCategory = app.buckets.filter((b) => b.name.toLowerCase() === typed)[0]
    return byCategory ? byCategory.id : null
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!amount) return
        onSubmit({ amount, label: forText.trim() || 'this', bucket: resolveBucket() })
      }}
    >
      <label className="big-amt" htmlFor="decide-amt">
        <span className="sm-sr">Amount</span>
        <span className="cur">{'₹'}</span>
        <input
          id="decide-amt"
          className="amt"
          inputMode="numeric"
          placeholder="___"
          value={amountText}
          autoComplete="off"
          onChange={(e) => setAmountText(e.target.value.replace(/[^\d]/g, ''))}
        />
      </label>

      <div className="quick-amts" role="group" aria-label="Common amounts">
        {QUICK_AMOUNTS.map((v) => (
          <button
            key={v}
            type="button"
            className="sm-chip soft"
            aria-pressed={String(v) === amountText}
            onClick={() => setAmountText(String(v))}
          >
            {F(v)}
          </button>
        ))}
      </div>

      <Combobox
        id="decide-for"
        label="For?"
        options={options}
        value={forText}
        onChange={(text, option) => {
          setForText(text)
          setForOption(option)
        }}
        placeholder="Cabs, tapri, delivery…"
        hint="Pick one or write it yourself. Not sure is fine — it only decides which category the check is against."
      />

      <Button type="submit" full disabled={!amount}>
        {submitLabel}
      </Button>
    </form>
  )
}
