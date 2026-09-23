# Margin — front end

React front end for Margin (the repository keeps its original `student-money` name), built
from the approved design handoff in `design/`. The name the app shows anywhere — widget,
notification, browser tab — comes from `APP_NAME` in `src/data/brand.ts`.

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

npm run verify:figures   # re-derive every figure in docs/ALGORITHMS.md and assert it
```

Requires Node 20+. No backend, no network calls — everything on screen comes from
`src/data/seed.ts`.

One build-time option: the app uses client-side routing, so a host that serves the built
files must rewrite unknown paths to `index.html`. Where that is not possible — an object
store, or a preview served from a subdirectory — build with hash routing instead:

```bash
VITE_HASH_ROUTER=true npm run build -- --base ./
```

The app is identical either way; only the URL shape changes (`/estimate` against
`#/estimate`). `src/main.tsx` picks the router from that variable.

## Remembering what the student enters

Everything they change — a payment added by hand, a relabelled transaction, a renamed
category, a plan — is written to the browser's own storage and read back on the next
load. `src/state/persistence.ts` is the only file that touches storage, so replacing it
with a backend later means changing `load` and `save` and nothing else.

Two consequences worth knowing:

- The data stays on the device. It never reaches a server, which is what keeps the
  onboarding promise ("Nothing leaves your phone") true. It also means it does not
  follow the student to another phone, and clearing browser data wipes it.
- Every read and write is wrapped in try/catch, because storage throws rather than
  returning empty in a private window or with site data blocked. A failure is never
  fatal — the app falls back to the demo data and carries on.

**Saving a plan is not the same as counting it.** Plans persist like everything else,
and still never enter a total: no selector reads `Plan.amount` (§2.4). There is a test
for exactly this — adding a ₹6,000 plan leaves free-to-spend and the projection
unmoved.

To clear everything and return to the demo month, open Profile → **What is stored on
this phone** → Clear everything. `studentMoney.reset()` in the browser console does the
same thing without the confirmation, which is handy when testing.

## Screens added beyond the handoff

Two screens exist here that are not in `prototype-v2.html`, because a shipped app needs
them and the prototype never had to. Both are built from existing design-system
components and keep the product's voice. **Both need the client's sign-off.**

- **Crash screen** (`src/components/ErrorBoundary.tsx`). Anything that throws during a
  render used to leave a blank white page. This states what happened, says the
  student's data is untouched, and offers to start again — with clearing as a second
  option only if the stored data is what is broken.
- **"What is stored on this phone"** (`src/sheets/DataSheet.tsx`, reached from a new row
  on Profile). CLAUDE.md §2.9 requires Profile to explain what is read *and how to edit
  or clear it*. The approved design covers the explaining and has no control for the
  clearing. The sheet lists what is held and asks a second time before removing it. The
  approved rows above it are untouched — this is an addition, not a change.

## Trying it with real numbers

The cog in the corner of Home opens **This month's figures** (`/setup`): money in, and
spent so far. Whatever is entered there stands in for the figures derived from the
transactions, and every screen follows from it — free to spend, the projection, the
category shares, the balance, the patterns. Category amounts keep their proportions and
are scaled to the total entered, so the breakdowns stay consistent.

Neither figure is a limit. The allowance is what came in; passing it changes nothing
about how the app behaves (§2.1). "Go back to the transaction figures" clears both.

## Deploying

`vercel.json` is set up for Vercel: unknown paths rewrite to `index.html` so client-side
routes survive a refresh and a shared deep link, hashed assets and fonts are cached for a
year, and every response carries `X-Robots-Tag: noindex, nofollow` so search engines do not
index the deployment. Vercel detects Vite on its own — no build settings to fill in.

**Before deploying anywhere public, two things need clearing with the client:**

- A Vercel production URL is open to anyone who has or guesses the link. The handoff asks
  that the prototype not go to a public URL. Use Vercel's password protection, or keep it
  to preview deployments, unless the client has said otherwise. The `X-Robots-Tag` header
  keeps it out of search results; it does not make the deployment private.
- Deploying serves the General Sans font files to every visitor, which is distribution.
  The licence scope for that is still open (see below).

At phone width the app fills the viewport. From 760px up it renders inside a centred device
frame with a simulated status bar, so the design can be reviewed on a desktop exactly as it
was signed off.

---

## What is built

All eight core screens, all overlays, and all four Phase 2 screens.

| Route | Screen | Notes |
|---|---|---|
| `/` | Home | Greeting, the decide form (amount + quick amounts + a type-or-pick "For?"), spent-against-allowance, Coming up. The check happens here; there is no separate estimate screen |
| `/setup` | This month's figures | Enter money in and spent so far by hand |
| `/result` | Here's the picture | Before/after, decrease visual, projection with nested splits, recent payments, cues, single "Noted" exit |
| `/spend` | Where it went | Spent against the allowance, then category shares that open to their sections |
| `/plans` | Plans | Scheduled vs TBD, swipe or drag to move, add via overlay |
| `/profile` | Profile | Balance, history link, Patterns, "What the app uses". The spending-analysis bars were removed as a repeat of Where it went |
| `/profile/transactions` | Transactions | Filterable list, sticky "Add a payment by hand" |
| `/profile/experience` | Experience | Week/month toggle, bars, comparison against Parisha's own previous period |
| `/cue` | Phase 2 — notification cue | Renders without the nav |
| `/widget` | Phase 2 — both widgets on a pretend phone home screen | Renders without the nav; reached from the star on Home |
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
docs/ALGORITHMS.md         every figure, how it is worked out, and what was assumed
scripts/verify-figures.mjs independent recomputation of every figure in that document
public/fonts/              General Sans .otf files
src/
  lib/                     formatINR, cx, the demo-month date helpers
  ui/                      the design system, ported to typed React
  data/                    types, seed data, assumptions, glossary definitions
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

Every assumed input now sits in `src/data/assumptions.ts` — opening balance, the August
comparison total, the thresholds behind each pattern and prompt, and the rounding rules —
with the basis for each one stated beside it. `docs/ALGORITHMS.md` §1.2 tabulates them.
Nothing else in the app holds a rupee figure except `src/data/seed.ts`.

Found while porting:

- `--positive` and `--on-canvas` are used in the prototype but defined nowhere. Resolved as
  described above; they should be added to `tokens.json` or removed from the prototype.
- **The displayed date does not agree with `TODAY`.** Home and the Cue print
  "Friday, 18 September" while every computed figure uses day 17 — and 17 September 2026
  is a Thursday. Left exactly as the prototype has it, held as `DISPLAY_DATE`. Resolving
  it one way changes the projection by ₹990; see `docs/ALGORITHMS.md` §8.3.
- **The weekday/weekend pattern rested on a single observation.** The prototype shows it
  whenever each side has one outing; in the demo month the weekend average comes from one
  Uber ride, captioned "Based on 12 outings this month". A `MIN_PATTERN_SAMPLE` of 3 per
  side now suppresses it, and the caption states both counts. Set the constant to 1 to
  restore the prototype's behaviour. See `docs/ALGORITHMS.md` §6.3.
- `components.css` sets `.sm-txn-amt.out` to `--money-out` on line 151 and then overrides it
  back to `--ink` on line 292, so outgoing amounts render dark and only incoming amounts are
  green. The prototype is the specification, so that is what is built — but it does not match
  rule 8 as written. Worth confirming which is intended.

---

## What is not built

Front end only, as scoped. There is no backend, no account linking, no persistence — state
lives in React and resets on reload. `src/data/seed.ts` is the only place that holds literal
amounts, so it is the single file to replace when a real feed lands.
