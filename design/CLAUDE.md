# Student Money — build brief

This file is the contract for anyone (human or agent) implementing this product. Read it
before writing code, and re-read the **Rules that must not be broken** section before adding
any screen, number or piece of copy.

---

## 1. What the product is

A financial *consciousness* app for students. It is not a budgeting app and not an expense
tracker. Its single job is to make the student aware of what a spend does to the rest of
their month, **before** they spend it, and to show them their own patterns afterwards.

The user is a student with an account balance, money coming in (allowance, transfers,
part-time work) and money going out. The app reads payment remarks and amounts. The student
labels payments; the app never guesses silently and never decides for them.

Primary persona in all copy and demo data: **Parisha**, September 2026, ₹18,000 in for the
month, ~₹10,057 spent by the 18th.

---

## 2. Rules that must not be broken

These come from the client's behavioural design work. A build that violates any of them is
wrong even if it looks right.

1. **No limits, caps or budgets.** No category limit, no monthly cap, no "you have used 80%
   of your Eating budget". Nothing in the data model may store a limit.
2. **No normative comparison.** Never compare the student with other students, averages or
   cohorts. Insights are *ipsative* — the student against their own history — or *contextual*
   (what this spend does to this month).
3. **No recommendations, no judgement.** The app never says "you should", "try to", "too
   much", "you overspent". It states what is, in the student's own numbers, and stops.
4. **Plans are qualitative cues, never money.** A plan may carry an amount the student typed,
   and that amount is displayed back to them, but it is **never** added to, subtracted from
   or counted in any total, projection, chart or insight. There is no "set aside" bucket.
   Plans exist to appear as a cue *before* a decision.
5. **Checking is not recording.** The Estimate → Result flow records nothing. It is a
   simulation of the rest of the month. Only a real transaction changes any total.
6. **The student owns the labels.** Categories and sections are renameable, movable and
   deletable by the student. Unlabelled payments are surfaced as "needs a label", never
   auto-assigned without a prompt the student can dismiss.
7. **Transactions read "For?", not vendor-first.** The question the app asks about a payment
   is what it was for, not who it was paid to.
8. **Red and green appear only on transaction amounts** (money in / money out). Nowhere else.
   No red "warning" states, no green "good job" states.
9. **Privacy is a feature.** All data is the student's; the Profile screen must keep the
   "What the app uses" section that explains what is read and how to edit or clear it.

---

## 3. Visual language

- Light mode only. Pastel only: black, white, greys and frosted neutrals, **butter yellows**
  and **powder blues**, with one accent blue (`--accent: #1d6fb8`) used sparingly.
- **Two hues per screen, one primary action per screen.** If a screen needs a third hue,
  the screen is doing too much.
- Corner radii are modest: `--radius-sm 8 / md 12 / lg 16 / xl 20 / pill 999`.
- Typeface: **General Sans** (files in `design-system/fonts/`). Confirm the licence covers
  the intended distribution before shipping; the source files were supplied by the client.
- Spacing discipline: 24px between logical groups, 12px uppercase section labels, no more
  than four groups above the fold.
- Category colours are fixed: Eating `powder-deep`, Travel `powder`, 7-Eleven `powder-soft`,
  Subscriptions `butter`, Gokhaana `butter-soft`, Shopping `grey-deep`, Essentials `grey-soft`.

Full rationale, contrast ratios and per-token usage notes: `design-system/README.md`
(the brand book) and `design-system/tokens.json`.

---

## 4. What is in this folder

```
CLAUDE.md                  this brief
README.md                  how to run and where to start
design-system/
  design-system.json       index of the system
  tokens.json              source of truth for colour, type, spacing, radius
  tokens.css               compiled :root custom properties + type utility classes
  README.md                brand book — rules, rationale, contrast, do/don't
  components/
    bundle.js              38 components, plain JS + React.createElement (no JSX)
    bundle.css             the styles those components expect
    index.d.ts             TypeScript signatures for every export
    <Component>/README.md  props, variants and usage per component
    <Component>/preview.html
  fonts/                   General Sans .otf files
prototype/
  prototype-v2.html        CURRENT clickable prototype — open this first
  screens-v2.js            the screen source inside it (readable, one function per screen)
  prototype-v1.html        earlier prototype, kept as a reference only
  screens-v1.js
```

`prototype-v2.html` is self-contained: tokens, fonts, component bundle and screens are all
inlined. Open it in a browser, no build step. It is the **specification**: where the brief and
the prototype disagree, ask before choosing.

---

## 5. Component library

`design-system/components/bundle.js` assigns `window.StudentMoney` and exports:

Icon, IconButton, Chip, SegmentedToggle, AvatarStack, CalendarHeader, GreetingHero,
HighlightCard, TaskCard, ProgressCard, PlanRow, BottomNav, Button, AppBar, SectionHeader,
LinkRow, AmountSummary, RingChart, BarChart, BucketBreakdown, BucketCard, TransactionRow,
FilterChips, DecisionInput, TextField, BottomSheet, PlanItem, NestedBreakdown, CategoryCard,
SelectField, ResultHeadline, ProjectionCard, InsightCard, CueRow, PieChart, BarList,
plus the helpers `formatINR` and `iconNames`.

They are written as plain functions calling `React.createElement`, deliberately framework-light
so they can be ported. A React/React Native rewrite should keep the **prop names and the
tone classes** (`.t-coral / .t-sunflower / .t-sky / .t-butter / .t-blush / .t-ink / .t-grey /
.t-soft`, each mapping to `--tone`) so the design system stays the single source of truth.

---

## 6. Screens to build

### Core flow
| Key | Screen | Purpose |
|---|---|---|
| `home` | Home | Greeting, the "Kharcha with friends?" check CTA (plus button, top of screen), the month card (free to spend, share bars per category, "See where it went"), Coming up cues |
| `estimate` | Estimated spend | Amount field + quick amounts + "For?" category. Records nothing |
| `result` | Here's the picture | Before/after free-to-spend with a visual of the decrease, projection card with a nested breakdown, recent payments in the selected category, cues, single "Noted" exit |
| `spend` | Where it went | Money in vs Spent summary, category cards with nested outlet breakdown and percentages |
| `txns` | Transactions | Filterable list, red/green amounts, sticky "Add a payment by hand" |
| `exp` | Experience | Past transactions visualised — week/month toggle, bars, comparison against the student's own previous period |
| `profile` | Profile | Balance, transaction history link, spending analysis bars, Patterns (ipsative insights), "What the app uses" |
| `plans` | Plans | Qualitative cues, Scheduled vs To be decided, swipe to move, add via overlay |

### Overlays / sheets
Filter sheet, transaction detail, add payment by hand, edit category & sections,
new plan (with the first-time Scheduled / To-be-decided choice), glossary info sheet,
labelling prompt.

### Phase 2 screens
| Key | Screen |
|---|---|
| `cue` | Notification cue shown before a known spending moment |
| `widget` | Home-screen widget |
| `onboard` | Onboarding |
| `empty` | Empty state (no data yet) |

Navigation: bottom nav is **Home, Plans, Profile** in that order, labels always visible, and a
back button on every screen inside a flow. The four Phase 2 screens render without the nav.

---

## 7. Copy rules

- Plain second person. Short sentences. No exclamation marks, no emoji.
- Amounts always `formatINR` (₹ with Indian digit grouping).
- Glossary terms — "free to spend", "at this pace", "categories and sections", "skipped" —
  have a `?` info tip that opens a definition sheet. Keep those definitions intact; they are
  what stops the numbers being misread as a budget.
- Footnotes state the basis of a number ("Worked out from your transactions up to today,
  18 September"), never a verdict.

---

## 8. Suggested build order

1. Port `tokens.css` and the font faces; confirm every colour resolves.
2. Port the component bundle, one component at a time, checking against its `preview.html`.
3. Build `home → estimate → result` end to end, since that is the product's reason to exist.
4. Then `spend`, `txns`, `exp`, `profile`, `plans`, then the overlays.
5. Phase 2 screens last.

## 9. Open items (decide with the client, do not invent)

- The "you skipped ₹X" insight has no data source now that the skipped exit was removed from
  the Result screen; either restore a way to record a skip or drop the insight.
- Nested breakdown blocks are distinguished by hue; add a non-colour cue for colour-blind users.
- Row anatomy differs slightly between Experience and Transactions; unify.
- General Sans licence scope for production distribution.
