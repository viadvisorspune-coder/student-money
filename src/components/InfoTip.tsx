import { TERMS, type TermKey } from '../data/terms'

/**
 * The `?` beside a glossary term. Opens the definition sheet (CLAUDE.md §7) —
 * these definitions are what stop the numbers being read as a budget.
 */
export function InfoTip({ term, onOpen }: { term: TermKey; onOpen: (t: TermKey) => void }) {
  return (
    <button
      type="button"
      className="infotip"
      aria-label={`What does “${TERMS[term].title}” mean?`}
      onClick={() => onOpen(term)}
    >
      ?
    </button>
  )
}
