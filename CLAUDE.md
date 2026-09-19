# Student Money — project context

Read `design/CLAUDE.md` before writing any code. It is the client's build brief and the
contract for this product: nine behavioural rules, the visual language, the screen list and
the copy rules. A build that violates any of those rules is wrong even if it looks right.

`design/prototype/prototype-v2.html` is the specification. Where the brief and the prototype
disagree, ask the client rather than choosing.

## Conventions in this repository

- React 19 + Vite + TypeScript, strict mode. No Tailwind and no CSS-in-JS — the design system
  is the single source of truth for styling.
- `src/styles/tokens.css` and `src/styles/components.css` are copied verbatim from the
  handoff. Never hand-edit them. `tokens.css` is generated from
  `design/design-system/tokens.json`; change the JSON and regenerate.
- `src/ui/` keeps the prop names and tone classes from
  `design/design-system/components/index.d.ts`. Each component's README in
  `design/design-system/components/<Name>/` stays the reference.
- Every amount is rendered through `formatINR` from `src/lib/format.ts`.
- Every derived figure lives in `src/state/selectors.ts` as a pure function. Two invariants
  hold across that file: nothing reads `Plan.amount`, and nothing compares the student with
  anyone but their own history.
- `src/data/seed.ts` is the only file holding literal transaction amounts, and
  `src/data/assumptions.ts` the only file holding assumed inputs and thresholds. Do not
  put a bare number in a screen — name it in `assumptions.ts` with its basis.
- `src/state/persistence.ts` is the only file that touches browser storage. Anything
  that needs to outlive a refresh goes through it; nothing else reads or writes storage.
- `docs/ALGORITHMS.md` states every algorithm with a worked example. Update it in the
  same commit as any change to `selectors.ts` or `assumptions.ts`, then run
  `npm run verify:figures`, which re-derives each quoted figure and fails on drift.

## Before adding a screen, number or piece of copy

Re-read `design/CLAUDE.md` §2. The rules easiest to break by accident are: no limits or
budgets anywhere in the data model, plans are never counted in a total, and no comparison
with other students.

Run `npm run build` and `npm run verify:figures` before committing.
