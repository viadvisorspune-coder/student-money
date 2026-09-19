/**
 * Glossary definitions behind every `?` info tip (CLAUDE.md §7).
 *
 * Keep these intact. They are what stops the numbers being misread as a budget.
 */
export const TERMS = {
  free: {
    title: 'Free to spend',
    body: 'Everything that came in this month, minus everything you have spent. It is not a budget and nothing is set aside — it is simply what is left of this month’s money.',
  },
  pace: {
    title: 'At this pace',
    body: 'What the month would add up to if the days left go like the days so far. It is an assumption, not a prediction, and it moves every time you spend.',
  },
  category: {
    title: 'Categories and sections',
    body: 'A category is a kind of spending, like Eating. A section is where inside it the money went — delivery apps, cafés, tapri. You decide both, and you can rename or move anything.',
  },
  skipped: {
    title: 'Skipped',
    body: 'Spends you checked and then decided against. Nothing is added or subtracted anywhere — it is only a note of what you talked yourself out of.',
  },
} as const

export type TermKey = keyof typeof TERMS
