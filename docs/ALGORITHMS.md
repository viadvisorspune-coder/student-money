# Student Money — algorithms and assumptions

Every number the app shows, how it is worked out, and what was assumed to get there.

This document is the companion to `src/state/selectors.ts` (the algorithms) and
`src/data/assumptions.ts` (the assumed inputs). Where the two disagree, the code is
right and this document is stale — each section names the function it describes.

All worked examples use the demo month in `src/data/seed.ts`: Parisha, September 2026,
38 transactions, evaluated at day 17. The figures quoted were taken from the running
build, not calculated by hand.

---

## 1. Inputs

### 1.1 The ledger

`src/data/seed.ts` holds 38 transaction rows, each one:

| Field | Meaning |
|---|---|
| `day` | Day of the month, 1–30 |
| `time` | 24h clock, used only for ordering within a day |
| `vendor` | Who was paid. Supporting detail on a row, never the headline |
| `forLabel` | What it was for, read from the payment remark. The headline |
| `amount` | Signed. Negative is money out, positive is money in |
| `bucket` | Category id, or `null` for "needs a label" |
| `income` | True for money in |
| `social` | Whether it was an outing with other people |
| `planned` | Whether it was decided ahead of the day |

Derived once at load:

- `income = true` when the source row's category was `'income'`; those rows also carry
  `bucket = null`, so income never lands in a category total.
- `frequent` is set by a vendor-name test, standing in for the student having said
  "I pay this often". It is editable per transaction.

The ledger is the only source of amounts. Nothing else in the app holds a rupee figure
except the constants in §1.2.

### 1.2 Assumption register

Everything in `src/data/assumptions.ts`. Each line is an input a later build replaces
with real data or a real product decision.

| Constant | Value | What it affects | Basis |
|---|---|---|---|
| `OPENING_BALANCE` | ₹15,000 | Profile balance only | **Assumed.** Not in the handoff. Needed so Profile can show an account balance |
| `PREVIOUS_MONTH_SPEND` | ₹7,650 | Experience → Monthly comparison | **Assumed.** Demo data covers September only. Chosen below September MTD so the comparison reads "more than" |
| `DISPLAY_DATE` | "Friday, 18 September" | Home and Cue headers | **Carried from the prototype, and inconsistent with `TODAY`.** See §8 |
| `QUICK_AMOUNTS` | 200/500/1000/2000 | Estimate chips | **Assumed.** Common student spends. Not limits |
| `FREQUENT_VENDOR_MIN_COUNT` | 3 | When the filing prompt appears | **Assumed.** Low enough to catch a habit within one month |
| `SMALL_OUTING_MAX` | ₹400 | "Small outings add up" pattern | **Assumed.** A spend not thought twice about on its own |
| `MIN_PATTERN_SAMPLE` | 3 | Weekday/weekend pattern | **Assumed, and new.** See §6.3 |
| `CUE_LOOKBACK_OCCURRENCES` | 3 | Cue's "last N Fridays" | **Assumed.** Keeps the cue inside the current month |
| `PROJECTION_ROUNDING` | ₹10 | Projection display | Rounding stops it reading as a precise forecast |
| `SPLIT_TOP_N` | 3 | Share lists | Matches the prototype |
| `NEST_MAX_LEVELS` | 4 | Nested breakdown blocks | Matches the prototype |

Per-category `usual` ranges live on each bucket in `seed.ts` — for example Eating
₹2,600–₹3,400. These stand for the student's own range by this date in earlier months.
They are **assumed**; in a real build they are computed from history. They are used in
one place only, the Eating pattern in §6.1, and never as a limit.

### 1.3 Period constants

`src/lib/calendar.ts`: `TODAY = 17`, `DAYS_IN_MONTH = 30`, September 2026.

---

## 2. The ledger figures

`totalIn`, `totalOut`, `balanceOf` in `src/state/selectors.ts`.

```
income  = Σ amount            over rows where income
spent   = − Σ amount          over rows where not income
free    = income − spent
balance = OPENING_BALANCE + income − spent
```

Worked, September to day 17:

| | |
|---|---|
| income | ₹18,000 |
| spent | ₹10,057 |
| **free to spend** | **₹7,943** |
| balance | ₹22,943 |

`free` is not a budget and nothing is set aside — it is arithmetic on the month's own
transactions, which is exactly what the glossary entry says. Unlabelled payments are
in `spent`: not knowing what a payment was for does not make the money still there.

`balance` is the only figure that touches `OPENING_BALANCE`, and it appears only on
Profile. No share, projection or pattern reads it.

---

## 3. Category and section aggregation

### 3.1 Category totals

`spentByBucket`.

```
spentBy[k] = − Σ amount   over outgoing rows whose bucket is k
             where k = bucket id, or '__none' when bucket is null
```

Income is skipped entirely, so the keys partition outgoing money and nothing else.

| Category | Amount |
|---|---|
| Eating | ₹3,860 |
| Shopping | ₹2,130 |
| Travel | ₹1,400 |
| Unlabelled (`__none`) | ₹1,000 |
| Essentials | ₹749 |
| Gokhaana | ₹340 |
| Subscriptions | ₹318 |
| 7-Eleven | ₹260 |
| **Total** | **₹10,057** |

The total equals `spent` by construction. This is the cheapest invariant to assert in
a test and the first thing to check after any change to labelling.

### 3.2 Which section a payment belongs to

`outletOf`, then `resolveBucket`. Resolution order:

1. If the transaction carries an explicit `outlet` the student chose, use it.
2. Otherwise, the first section whose `vendors` list contains this vendor.
3. Otherwise `'__none'`, shown as "Unlabelled" inside the category.

The student's own choice always wins, and it persists — editing one payment does not
re-derive from the vendor list afterwards.

A payment with no category at all resolves to "Needs a label" and is surfaced, never
auto-assigned.

Eating, worked:

| Section | Vendors | Amount |
|---|---|---|
| Delivery apps | Swiggy, Zomato | ₹2,550 |
| Cafés | Third Wave Coffee, Café Goodluck, Starbucks | ₹890 |
| Tapri & canteen | Chai tapri, College canteen | ₹420 |
| **Total** | | **₹3,860** |

---

## 4. The projection — "at this pace"

`project`.

```
rate       = (spent + extra) / TODAY
projection = round( (spent + extra + rate × (DAYS_IN_MONTH − TODAY)) / 10 ) × 10
```

`extra` is a simulated spend and is zero everywhere except the Result screen.

Worked, no simulation:

```
rate       = 10,057 / 17            = ₹591.59 per day
raw        = 10,057 + 591.59 × 13   = ₹17,747.65
projection = ₹17,750
```

Properties worth knowing before anyone reads more into it:

- It is a flat extrapolation of the month's own average daily rate. It has no weekday
  effect, no seasonality and no knowledge of what is coming.
- It ignores plans entirely, including plans with an amount attached (§7).
- It moves every time a payment lands, and the earlier in the month it is, the more a
  single payment moves it — at day 3, one payment is a third of the rate.
- Rounding to ₹10 is deliberate: the figure is an assumption about the rest of the
  month and should not read as a forecast to the rupee.

The screen always states the basis next to it: "projected for September if you spend
this and the rest of the month goes like the last 17 days."

---

## 5. Shares

`splitsOf`. Used by Home's bars, the Result projection card and the widget.

```
by      = spentBy, plus `extra` added to `extraBucket` when simulating
total   = Σ by
list    = categories with by > 0, plus Unlabelled, sorted by amount desc
top     = first SPLIT_TOP_N, then one "Other" row holding the rest
pct     = round( amount / total × 100 )   per row
```

Worked, no simulation (total ₹10,057):

| Row | Amount | Share |
|---|---|---|
| Eating | ₹3,860 | 38% |
| Shopping | ₹2,130 | 21% |
| Travel | ₹1,400 | 14% |
| Other | ₹2,667 | 27% |

"Other" folds Unlabelled ₹1,000, Essentials ₹749, Gokhaana ₹340, Subscriptions ₹318
and 7-Eleven ₹260.

Two properties:

- The denominator is **spending**, not money in. A share answers "what part of what I
  spent went here", not "what part of my money".
- Each percentage is rounded independently, so the column need not total 100. It does
  in the demo month, by luck. If a screen ever needs them to add up, the rounding has
  to change to a largest-remainder method — no screen needs that today.

---

## 6. Patterns

`patternsOf`. Every pattern is *ipsative* — Parisha against her own history — or
contextual. None compares her with another student, an average or a cohort, and none
tells her what to do. Each renders with a footnote stating its basis.

### 6.1 Eating against her usual range

```
shown when the Eating category exists and carries a `usual` range
text   "Eating is {spentBy.eat} this month. Your usual range by this date is {lo}–{hi}."
detail spentBy.eat > hi  ?  "Above your usual range, mostly from delivery apps."
                          :  "Inside your usual range."
```

Worked: Eating ₹3,860 against ₹2,600–₹3,400 → above. Note the wording: *above your
usual range*, which is a fact about her own history. Not "too much", which would be a
verdict, and not a limit, because nothing is capped and nothing turns red.

### 6.2 Social outings

```
social      = outgoing rows where social
socialTotal = − Σ amount over social
spontaneous = social rows where not planned
```

Worked: ₹3,165 across 12 occasions, 11 decided on the day.

### 6.3 Weekday against weekend

```
weekday = social rows on Mon–Fri      weekend = social rows on Sat–Sun
avg(l)  = round( −Σ amount / |l| )
shown when |weekday| ≥ MIN_PATTERN_SAMPLE and |weekend| ≥ MIN_PATTERN_SAMPLE
detail  "Based on {|weekday|} weekday and {|weekend|} weekend outings this month."
```

**This is the one algorithm that differs from the prototype**, and it is worth a
decision rather than a default.

The prototype shows the pattern whenever each side has at least one observation. In
the demo month that means: 11 weekday outings averaging ₹259, and **one** weekend
outing of ₹318 — the Uber to Koregaon Park on Sunday the 6th. The prototype then
prints "Based on 12 outings this month", which describes the combined count and not
the one observation the weekend half of the sentence actually rests on.

Presenting a single transaction as "on weekends it averages ₹318" is the kind of thing
a student would reasonably act on, and it would be wrong. So:

- `MIN_PATTERN_SAMPLE = 3` is required on **each** side.
- The footnote states both counts, so the reader can see how thin each average is.

With the demo data the pattern is therefore suppressed, and Profile shows three
patterns rather than four. Setting `MIN_PATTERN_SAMPLE = 1` restores the prototype's
behaviour exactly. **This needs the client's agreement**: the threshold is a judgement
about when a difference is worth showing, not a technical detail.

### 6.4 Small outings add up

```
small = outgoing social rows where −amount ≤ SMALL_OUTING_MAX
shown when |small| > 2
```

Worked: 11 outings of ₹400 or less, ₹2,647 together. The detail line — "Each one
looked small on its own" — is the whole point, and it stops there.

### 6.5 Skipped

The "you checked and then skipped ₹X" insight reads `skipped`, which nothing writes,
because the skipped exit was removed from the Result screen. The state, the reducer
(`recordSkip`) and the copy on Home and Profile are all in place; only the trigger is
missing, so the insight never appears. This is open item 1 in §9.

---

## 7. The check — Estimate to Result

The product's reason to exist, and the flow with the strongest rule around it:
**it records nothing.**

```
decision = { amount, label, bucket }        // held in React state only
after            = free − amount
bucketAfter      = spentBy[bucket] + amount
projection       = project(spent, amount)
splits           = splitsOf(buckets, spentBy, amount, bucket)
categoryShare    = round( bucketAfter / (spent + amount) × 100 )
daysLeft         = DAYS_IN_MONTH − TODAY
```

The simulated amount is passed as an **argument** into each function. It never enters
the store, so there is no code path by which a check can alter a total. Leaving the
screen through "Noted" clears the decision and nothing else changes.

Worked, ₹700 on Eating:

| | |
|---|---|
| free before | ₹7,943 |
| free after | ₹7,243 |
| Eating this month, after | ₹4,560 |
| share of everything spent | 42% |
| projection | ₹18,980 |
| days to go | 13 |

Derivation of the projection: rate becomes (10,057 + 700) / 17 = ₹632.76/day, so
10,757 + 632.76 × 13 = ₹18,982.94, rounded to ₹18,980.

The shares recompute against the simulated total of ₹10,757, which is why Shopping
slips from 21% to 20% without Parisha having spent anything on Shopping.

**Plans never enter any of this.** A plan may carry an amount she typed — the Goa trip
says ₹6,000 — and that figure is displayed back to her on the Plans screen and in the
cue rows. It is a string, it is never parsed into any total, and no function in
`selectors.ts` reads `Plan.amount`. That invariant is stated at the top of the file and
is the first thing to check if a plan ever starts showing up in a figure.

---

## 8. Experience — periods and comparison

`src/screens/Experience.tsx`.

### 8.1 Weekly

```
bars      one per day over [TODAY−6, TODAY], value = that day's outgoing total
prevTotal outgoing total over [TODAY−13, TODAY−7]
diff      round( (Σ bars − prevTotal) / prevTotal × 100 )
```

Worked: 11–17 Sep ₹4,952 against 4–10 Sep ₹4,077 → **21% more than last week**.

### 8.2 Monthly

```
bars      fixed windows 1–7, 8–14, 15–21
prevTotal PREVIOUS_MONTH_SPEND
```

Worked: ₹3,965 + ₹4,354 + ₹1,738 = ₹10,057 against August ₹7,650 → **31% more than
August (so far)**.

Two things about this view:

- The third window, 15–21, is **partial** — today is the 17th, so it holds three days
  against the other windows' seven. The bar is genuinely shorter for that reason and
  not because spending fell. The "(so far)" in the comparison label is doing a lot of
  work; a shaded or labelled partial bar would carry it better.
- The windows are fixed calendar spans, not rolling weeks, so they do not line up with
  the weekly view's [TODAY−6, TODAY].

Selecting a bar filters the whole screen — total, category breakdown and transaction
list — to that day or window. Deselecting restores the period.

### 8.3 The date inconsistency

Home and the Cue print "Friday, 18 September". Every computed figure, the "Today" row
label and the Profile footnote use day 17. 17 September 2026 is a Thursday; the 18th is
the Friday. The brief's own summary says "~₹10,057 spent by the 18th", which agrees with
the displayed string rather than with `TODAY`.

This has been left exactly as the prototype has it, because resolving it either way
changes an approved screen:

- **Display becomes 17 September.** Nothing recalculates; Home reads "Thursday, 17
  September". Smallest change, but contradicts the brief's own wording.
- **`TODAY` becomes 18.** The daily rate falls to ₹558.72 and there are 12 days left
  rather than 13, so the projection drops from ₹17,750 to ₹16,760 — a ₹990 move on a
  one-day change. The weekly window shifts to 12–18 Sep, and the "Today" row moves to a
  day with no transactions on it. `free`, `spent` and every share are unaffected, since
  none of them divides by the day count.

A decision is needed. It is held as `DISPLAY_DATE` so that when it is made, one
constant changes.

---

## 9. Two more algorithms

### 9.1 The cue's weekday average

`weekdayAverage`. What a notification quotes before a known spending moment.

```
days    the last CUE_LOOKBACK_OCCURRENCES occurrences of that weekday before TODAY
average round( total outgoing on those days / |days| )
```

Days with no spending still count as occurrences, so a quiet Friday pulls the average
down rather than dropping out of the sample — otherwise the cue would quote a figure
biased upward by only ever counting the Fridays she spent.

Worked: the Fridays before day 17 are the 4th (₹1,579) and the 11th (₹430). Only two
are available, so the cue reports its true sample — "Last **2** Fridays you spent
₹1,005 on average" — rather than claiming three.

### 9.2 Nested breakdown geometry

`NestedBreakdown` in `src/ui/charts.tsx`. How the stacked blocks inside a category card
are sized.

```
items sorted desc, tail beyond NEST_MAX_LEVELS folded into "Other"
c_i   = 1 − Σ(shares before i)        remaining cumulative share, including i
s_i   = √c_i
h_0 = H                 h_i = clamp( H × s_i,   min 64px,  max h_{i−1} − 66 )
w_0 = 100%              w_i = clamp( 100 × s_i, min 36%,   max w_{i−1} − 20 )
```

Both dimensions scale by the square root, so a block's **area** falls linearly with the
share remaining at that level. The clamps guarantee each block stays visibly inset from
the one behind it and never collapses.

Worked, Eating at H = 280:

| Block | Share | c | height | width |
|---|---|---|---|---|
| Delivery apps | 66% | 1.000 | 280px | 100% |
| Cafés | 23% | 0.339 | 163px | 58% |
| Tapri & canteen | 11% | 0.109 | 92px | 36% (clamped) |

The blocks are distinguished by hue alone, which is open item 2 in §10.

---

## 10. What the algorithms do not do

Held in code, not only in copy. Each is worth a test.

| Rule | How it holds |
|---|---|
| No limits, caps or budgets | No such field on any type in `src/data/types.ts`. No function takes one. `BucketCard` and `CategoryCard`'s `limit` prop are not ported |
| No comparison with others | Every comparison in `patternsOf` and Experience is against Parisha's own earlier figures |
| No recommendations | No function returns a verdict. `patternsOf` returns statements and their basis |
| Plans are never money | No function reads `Plan.amount` |
| Checking is not recording | The simulated amount is an argument, never state |
| Red and green only on amounts | `--money-in` and `--money-out` appear on `.sm-txn-amt` and `.txn-amt` only |

Suggested assertions, in rough order of value:

1. `Σ spentBy === spent` after any labelling change.
2. `free === income − spent`, and `free` unchanged after a check.
3. Adding a plan with an amount moves no figure on Home, Result or Experience.
4. `project(spent, x) > project(spent, 0)` for `x > 0`, and both round to ₹10.
5. A pattern is only emitted when its stated sample size is met.

---

## 11. Open questions

Carried from `design/CLAUDE.md` §9 and found while writing this down. All four need a
client decision, not an engineering one.

1. **The skipped insight has no trigger.** Restore a way to record a skip on the Result
   screen, or drop the insight and its glossary entry (§6.5).
2. **Nested blocks are distinguished by hue only.** A non-colour cue is needed for
   colour-blind users (§9.2).
3. **The display date does not agree with `TODAY`.** Two resolutions, with different
   knock-on effects (§8.3).
4. **`MIN_PATTERN_SAMPLE`.** Confirm three, or set it back to one and accept an average
   drawn from a single outing (§6.3).

And two assumed amounts that should become real data before anyone reads a figure as
fact: `OPENING_BALANCE` and `PREVIOUS_MONTH_SPEND` (§1.2).
