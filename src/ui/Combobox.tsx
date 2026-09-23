import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '../lib/cx'
import { Icon } from './primitives'

export interface ComboOption {
  /** The stable id, e.g. a section id. */
  value: string
  /** What the student reads and types against, e.g. "Cabs & autos". */
  label: string
  /** The category it sits under, shown quietly beside it. */
  group?: string
}

export interface ComboboxProps {
  label: string
  options: ComboOption[]
  /** The text in the box. Free text is as valid as a pick from the list. */
  value: string
  onChange: (text: string, option?: ComboOption) => void
  placeholder?: string
  hint?: React.ReactNode
  id?: string
}

/**
 * Type it or pick it, in one box.
 *
 * A plain select forces the student into the app's own words. This lets them choose a
 * section — "Cabs & autos", "Tapri & canteen" — or type whatever it actually was, which
 * is what §2.6 means by the student owning the labels. Typing filters the list; nothing
 * is rejected for being off-list.
 *
 * Follows the ARIA combobox pattern so it is usable by keyboard and screen reader:
 * arrows move through the options, Enter takes the highlighted one, Escape closes.
 */
export function Combobox({ label, options, value, onChange, placeholder, hint, id }: ComboboxProps) {
  const auto = useId()
  const fieldId = id || `cb-${auto}`
  const listId = `${fieldId}-list`

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)

  const query = value.trim().toLowerCase()
  const matches = query
    ? options.filter((o) => o.label.toLowerCase().includes(query) || (o.group || '').toLowerCase().includes(query))
    : options

  // Close when the student taps away, so the list never sits over the rest of the form.
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent | TouchEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [open])

  function choose(o: ComboOption) {
    onChange(o.label, o)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        setActive(0)
        return
      }
      const next = e.key === 'ArrowDown' ? active + 1 : active - 1
      setActive((next + matches.length) % Math.max(1, matches.length))
    } else if (e.key === 'Enter') {
      if (open && matches[active]) {
        e.preventDefault()
        choose(matches[active])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="sm-field sm-combo" ref={wrap}>
      <label htmlFor={fieldId} className="l">
        {label}
      </label>

      <div className="box">
        <input
          id={fieldId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${listId}-${matches[active].value}` : undefined}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="sm-combo-toggle"
          aria-label={open ? 'Hide the list' : 'Show the list'}
          tabIndex={-1}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name="chevron-down" size={20} />
        </button>
      </div>

      {open ? (
        <ul className="sm-combo-list" id={listId} role="listbox" aria-label={label}>
          {matches.length ? (
            matches.map((o, i) => (
              <li key={o.value} id={`${listId}-${o.value}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className={cx('sm-combo-opt', i === active && 'on')}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o)}
                >
                  <span className="n">{o.label}</span>
                  {o.group ? <span className="g">{o.group}</span> : null}
                </button>
              </li>
            ))
          ) : (
            // Off-list is fine: whatever they typed is the label.
            <li className="sm-combo-free">Nothing matches. &ldquo;{value.trim()}&rdquo; will be used as typed.</li>
          )}
        </ul>
      ) : null}

      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  )
}
