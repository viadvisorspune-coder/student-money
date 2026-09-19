# Student Money — front end

React front end for Student Money, built from the approved design handoff in `design/`.

**Confidential.** This repository contains the client's unreleased product design. Keep it
private; do not publish the prototype or any build of this app to a public URL.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm run typecheck  # tsc only
```

Requires Node 20+. No backend, no environment variables, no network calls — everything on
screen comes from `src/data/seed.ts`.

At phone width the app fills the viewport. From 760px up it renders inside a centred device
frame with a simulated status bar, so the design can be reviewed on a desktop exactly as it
was signed off.

---

## What is built

All eight core screens, all overlays, and all four Phase 2 screens.

| Route | Screen | Notes |
|---|---|---|
| `/` | Home | Greeting, "Kharcha with friends?" CTA, month card with share bars, Coming up |
| `/estimate` | Estimated spend | Amount + quick amounts + "For?". Records nothing |
| `/result` | Here's the picture | Before/after, decrease visual, projection with nested splits, recent payments, cues, single "Noted" exit |
| `/spend` | Where it went | Money in vs Spent, a card per category with its sections nested inside |
| `/plans` | Plans | Scheduled vs TBD, swipe or drag to move, add via overlay |
| `/profile` | Profile | Balance, history link, spending analysis, Patterns, "What the app uses" |
| `/profile/transactions` | Transactions | Filterable list, sticky "Add a payment by hand" |
| `/profile/experience` | Experience | Week/month toggle, bars, comparison against Parisha's own previous period |
| `/cue` | Phase 2 — notification cue | Renders without the nav |
| `/widget` | Phase 2 — home-screen widget | Renders without the nav |
| `/onboarding` | Phase 2 — onboarding | Renders without the nav |
| `/empty` | Phase 2 — empty state | Renders without the nav |

Overlays: filter sheet, transaction detail, add payment by hand, edit category & sections,
new plan (with the first-time Scheduled / TBD choice), glossary info sheet, labelling prompt.
They live in `src/sheets/` and are mounted once in `src/components/Shell.tsx` so they survive
navigation within a flow.

Navigating to `/result` without having made a check redirects to `/estimate`, since the Result
screen has nothing to show without a decision.

---

## Layout

```
design/                    the handoff, unchanged — CLAUDE.md is the contract
public/fonts/              General Sans .otf files
src/
  lib/                     formatINR, cx, the demo-month date helpers
  ui/                      the design system, ported to typed React
  data/                    types, seed data, glossary definitions
  state/                   AppContext (the store) and selectors (every derived figure)
  screens/                 one file per screen
  sheets/                  the overlays
  components/              Shell (frame, nav, overlays, toast), InfoTip, Swipeable
  styles/                  tokens.css, fonts.css, components.css, screens.css
```

### Styles

`src/styles/tokens.css` and `src/styles/components.css` are copied **verbatim** from the
handoff. Do not hand-edit them: `tokens.css` is generated from `design/design-system/tokens.json`,
so change the JSON and regenerate.

`src/styles/screens.css` is the prototype's screen CSS with two changes, both marked in the
file header:

- The prototype's own harness (`.wrap`, `.guide`, the fixed 390×844 `.phone`) is replaced by
  the responsive app shell.
- Two variables the prototype referenced but never defined are resolved:
  `--positive` → `--money-in` (it is used only on an incoming transaction amount) and
  `--on-canvas` → `--on-ink`. Neither exists in `tokens.json`; the prototype was rendering
  these as inherited colour.

No Tailwind, no CSS-in-JS. The design system is the single source of truth.

### Components

`src/ui/` keeps the prop names and tone classes from
`design/design-system/components/index.d.ts` exactly, so each component's
`design/design-system/components/<Name>/README.md` remains the reference. They are grouped
into `primitives`, `layout`, `fields`, `charts` and `cards`, and re-exported by name from
`src/ui/index.ts` — `import { CategoryCard } from '../ui'` works as it would have from the
bundle.

---

## The behavioural rules

`design/CLAUDE.md` §2 lists nine rules a build must not break. How each is held here:

1. **No limits, caps or budgets.** No such field exists on any type in `src/data/types.ts`,
   and no screen renders one. See the omissions below.
2. **No normative comparison.** `patternsOf` in `src/state/selectors.ts` compares Parisha
   only with her own history; Experience compares only with her own previous period.
3. **No recommendations, no judgement.** Every figure is stated with its basis and stops.
4. **Plans are qualitative cues, never money.** `Plan.amount` is a string shown back to the
   student. No function in `selectors.ts` reads it — that invariant is stated at the top of
   the file and is the thing to check first if plans ever start appearing in a total.
5. **Checking is not recording.** The Estimate → Result flow writes nothing. `splitsOf` and
   `project` take the simulated amount as an argument rather than through the store.
6. **The student owns the labels.** Categories and sections are renameable, recolourable and
   deletable; deleting a category returns its payments to "needs a label" rather than
   deleting them. Nothing is auto-filed without a prompt that can be dismissed.
7. **Transactions read "For?", not vendor-first.** `TransactionRow`'s headline is the payment
   remark; the vendor is supporting detail on the second line.
8. **Red and green only on transaction amounts.** `--money-in` and `--money-out` appear on
   `.sm-txn-amt` and `.txn-amt` and nowhere else in either stylesheet.
9. **Privacy is a feature.** The Profile screen keeps its "What the app uses" section, and
   onboarding step two is the student choosing what may be read.

---

## Deliberate omissions

**`BucketCard` is not ported.** It renders "₹X of ₹Y · ₹Z left" with an "over" state — that
is a limit, which rules 1 and 3 forbid, and no screen in `prototype-v2.html` uses it. It
remains in `design/design-system/components/bundle.js` if the client wants it revisited.

**`CategoryCard`'s optional `limit` prop is dropped** for the same reason; the Where it went
screen never passes it.

Both are worth a word with the client: they are the only places where the component bundle
and the brief pull in different directions.

---

## Open items

Carried over from `design/CLAUDE.md` §9, still undecided:

- The "you skipped ₹X" insight has no data source, because the skipped exit was removed from
  the Result screen. The plumbing is in place (`skipped` state, `recordSkip`, and the Home
  and Profile copy that reads it), but nothing calls it — so the insight never appears.
  Either restore a way to record a skip on the Result screen, or drop the insight and its
  glossary entry.
- Nested breakdown blocks are distinguished by hue only. A non-colour cue is needed for
  colour-blind users.
- Row anatomy differs slightly between Experience and Transactions. Unify once the client
  picks which one is right.
- General Sans licence scope for production distribution.

Found while porting:

- `--positive` and `--on-canvas` are used in the prototype but defined nowhere. Resolved as
  described above; they should be added to `tokens.json` or removed from the prototype.
- `components.css` sets `.sm-txn-amt.out` to `--money-out` on line 151 and then overrides it
  back to `--ink` on line 292, so outgoing amounts render dark and only incoming amounts are
  green. The prototype is the specification, so that is what is built — but it does not match
  rule 8 as written. Worth confirming which is intended.

---

## What is not built

Front end only, as scoped. There is no backend, no account linking, no persistence — state
lives in React and resets on reload. `src/data/seed.ts` is the only place that holds literal
amounts, so it is the single file to replace when a real feed lands.
