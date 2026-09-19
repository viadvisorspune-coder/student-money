import { useState, type ReactNode } from 'react'
import { Icon } from './primitives'

function slug(label: string, prefix: string) {
  return prefix + '-' + String(label || 'field').replace(/\W+/g, '-').toLowerCase()
}

/* --------------------------------------------------------------- TextField */

export interface TextFieldProps {
  label: string
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  prefix?: string
  hint?: ReactNode
  multiline?: boolean
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url' | 'none'
  id?: string
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  hint,
  multiline,
  inputMode,
  id,
}: TextFieldProps) {
  const fieldId = id || slug(label, 'f')

  return (
    <div className="sm-field">
      <label htmlFor={fieldId} className="l">
        {label}
      </label>
      <div className="box">
        {prefix ? <span className="pre">{prefix}</span> : null}
        {multiline ? (
          <textarea
            id={fieldId}
            value={value ?? ''}
            placeholder={placeholder}
            rows={3}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : (
          <input
            id={fieldId}
            value={value ?? ''}
            placeholder={placeholder}
            inputMode={inputMode}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}
      </div>
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  )
}

/* ------------------------------------------------------------- SelectField */

export interface SelectFieldProps {
  label: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  hint?: ReactNode
  id?: string
}

export function SelectField({ label, options = [], value, onChange, placeholder, hint, id }: SelectFieldProps) {
  const fieldId = id || slug(label, 's')

  return (
    <div className="sm-field sm-select">
      <label htmlFor={fieldId} className="l">
        {label}
      </label>
      <div className="box">
        <select id={fieldId} value={value || ''} onChange={(e) => onChange?.(e.target.value)}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={20} />
      </div>
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  )
}

/* ----------------------------------------------------------- DecisionInput */

export interface DecisionInputProps {
  onSubmit?: (text: string) => void
  eyebrow?: string
  placeholder?: string
  label?: string
  submitLabel?: string
  suggestions?: string[]
  onSuggest?: (s: string) => void
  id?: string
}

export function DecisionInput({
  onSubmit,
  eyebrow,
  placeholder,
  label,
  submitLabel,
  suggestions,
  onSuggest,
  id,
}: DecisionInputProps) {
  const [text, setText] = useState('')

  return (
    <form
      className="sm-card sunflower sm-decide"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(text)
      }}
    >
      <p className="sm-eyebrow">{eyebrow || 'Make a decision'}</p>
      <div className="sm-decide-row">
        <input
          id={id || 'decision'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder || 'Kharcha?'}
          aria-label={label || 'What do you want to spend on?'}
          autoComplete="off"
        />
        <button type="submit" className="sm-iconbtn dark sm-lg" aria-label={submitLabel || 'See the impact'}>
          <Icon name="arrow-up-right" />
        </button>
      </div>
      {suggestions ? (
        <div className="sm-decide-sugg">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="sm-chip light"
              onClick={() => {
                setText(s)
                onSuggest?.(s)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  )
}
