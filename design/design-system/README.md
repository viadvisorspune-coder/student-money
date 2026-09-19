Student Money helps students notice where their money goes. The interface is a stack of soft, rounded cards on a black backdrop: each card is one idea, and colour tells you what kind of idea it is.

## Content fundamentals

- Speak to the student as “you”, in plain, encouraging sentences. Praise progress before pointing out problems: “You are doing well”, then “₹1,200 left for food this week”.
- Sentence case everywhere: “Rent payment”, “Weekly”, “Today”. No exclamation marks, no finance jargon without a one-line explanation.
- Numbers lead: show the amount or percentage large, the explanation small. Always show a sign and currency: “+15%”, “−₹450”, “₹8,000”.
- No emoji in UI copy. Illustrate with avatars and icons instead.
- Example greeting: “Hello Aarav, your savings score is **above average**”, with the verdict in weight 600.

## Visual foundations

**Colour.** The whole product is light. Screens sit on `canvas`, a soft grey ground, with `surface` cards and `surface-frost` panels separated by hairline `line`. Text is `ink`, with `ink-muted` for anything secondary.

There are two hues and nothing else: butter yellow and powder blue, both pastel.
- `butter` marks the one thing asking for attention now (the Kharcha check); `butter-soft` is a quiet highlight.
- `powder-deep` is the brand blue and the leading chart tone; `powder` is its lighter partner.
- `grey-deep` and `grey-soft` fill out the chart palette, and `ink` is the one strong tone — used as a fill only for the primary button, the active nav pill and the arrow button.
- `accent`, a deep powder blue, is the only saturated colour. It marks the next action — the primary button, the plus, the active tab, a selected chip — and it carries money coming in. `accent-soft` is the same blue at chart strength.

Red and green appear in exactly one place: the sign of a transaction. Money out is `money-out` with a − and an up-right arrow; money in is `money-in` with a + and a down-left arrow. Both are text colours only, never fills, and neither judges a spend — they are there so a list of payments reads at a glance.

**One primary per screen.** Exactly one thing on a screen may wear `butter` or `accent` as a fill. Everything else is neutral. If a second thing wants to be primary, the screen is doing too much.

**Type.** One family, General Sans, upright weights 300/400/500/600/700. The headline pattern is `text-display` at 400 with the key phrase at 600. Big numbers use `text-metric` at 300. Card titles use `text-title`. Everything small uses `text-body`, `text-label` or `text-caption`. There is no italic in UI.

**Shape and layout.** Cards touch with a `space-1` gap and use `radius-xl` (20px — soft, not round), so the stack reads as one object. Rows and inputs use `radius-md`, chart blocks `radius-lg`. Pad cards with `space-5`. Chips, toggles, pills, avatars and icon buttons are always `radius-pill`. Put a card’s action row at its foot, with chips on the left and a dark round arrow button on the right.

**Depth and motion.** No shadows or gradients. Cards separate from the ground by a hairline and by the grey showing between them. Pressed states darken the fill by one step (`surface-soft` → `#e2e2e2`, ink → `#2a2a2a`). Motion is 200ms ease-out and limited to toggles and sheets.

**Focus.** Every interactive element gets a 2px solid `focus-ring` outline with a 2px offset. On `canvas`, use `on-canvas`.

**Money.** Format every amount with `formatINR` (Indian digit grouping: ₹1,20,000). Incoming money is `positive` with a + sign and a down-left arrow; outgoing money is `coral-strong` with a − sign and an up-right arrow; only a figure the student set for themselves and has passed turns `coral-strong`. A bucket is a category (Eating, Travel…) split into sections by outlet type (delivery apps, cafés, tapri & canteen, 7-Eleven). Show a category's sections with CategoryCard: the outer block is the bucket colour and inner blocks follow the fixed ramp `butter`, `sky`, `surface-soft`, `coral` (skipping the outer colour). Bucket colours are fixed per bucket across every chart, badge and meter: Eating `powder-deep`, Travel `powder`, 7-Eleven `powder-soft`, Subscriptions `butter`, Gokhaana `butter-soft`, Shopping `grey-deep`, Essentials `grey-soft`. No category is ever filled with `ink`: the one dark fill belongs to buttons and the active tab.

**Hierarchy on a screen.** A screen reads top-left to bottom-right, so it is built in that order: who and when (small), then the one action (the largest, warmest block on the screen), then the figure that answers “where do I stand”, then supporting detail, then anything optional. One number per screen is allowed to be large. Sections are separated by 24px of ground and opened by a 12px uppercase label; rows inside a card sit 6–8px apart. Cards never nest more than one level, and no screen carries more than four groups above the fold.

**Screens.** A tab screen stacks cards on `canvas` above BottomNav (Home, Plans, Profile, every tab labelled, the active one in a white pill). A sub-screen opens with AppBar and a back button, and no BottomNav. Details and edits open in BottomSheet over the current screen.

**The decision moment.** Home answers three questions in order: what happens if I spend this, what has been happening with my money, and what else matters right now. Home opens with the greeting set in plain type on `canvas` — no card, no profile icon, since the nav already reaches Profile — then the “this month” visual, then one CTA (“Kharcha with friends? Check before you spend”), which leads into a two-step flow: an estimate (amount plus an optional “For?”) and a result (ResultHeadline, ProjectionCard, the coming-up cues, and a Noted button back to Home). Nothing in that flow is recorded — it shows a consequence and leaves the choice to the student.

**Plans are qualitative.** A plan is a cue, not a budget: title, when, an amount the student types for themselves, and free-text notes. That amount is theirs to look at — it is shown back on the plan and nowhere else, and nothing in Plans enters a total, a projection, a category or a chart. There is no “set aside” anywhere in the product. A new plan is created in a BottomSheet overlay, and it only lands in the list once the student has picked Scheduled or TBD there; after that, dragging is the only way to move it between the two.

**Charts.** Home splits the month's allowance as a donut — each category's share of everything the student had, with the unspent remainder as its own quiet slice — so a spend reads against the whole month rather than against what is already gone. Profile compares categories as horizontal bars, which stay readable past four categories where rings do not.

**No limits.** The product never sets a budget, cap or limit on a category, and never marks spending as good or bad against one. Charts and cards report what was spent, as a figure and as a share of the month, and the student judges it. A reference figure appears only where the student typed one.

**Patterns.** Only two kinds of insight are shown: comparing the student with their own past (“You vs yourself”) and showing when their behaviour changes (“This changes when…”), plus accumulation, which adds small separate spends into one figure. Never compare the student with other people, judge them, or recommend an action — those break trust and can backfire. Every sentence names real figures from their own data.

**Transactions read “For?”, not the vendor.** The payment remark is the row's title and the vendor is the supporting line, since a student remembers “dinner with Riya”, not “SWIGGY PVT LTD”. Where there is no remark, the vendor stands in. Anything the app cannot place is shown as needing a label, never silently guessed, and every label the student writes is editable.

## Iconography

Icons are 1.75px-stroke line glyphs on a 24px grid with round caps: navigation and actions (arrow-up-right, arrow-down-left, arrow-left, check, close, edit, plus, filter, grip, trash, share) and bucket glyphs (food, bus, play, bag, receipt, target, wallet). The bundle’s `Icon` ships simple placeholders drawn to match the reference. Swap them for a licensed set with the same stroke (for example Phosphor Regular) before release. Icons inside dark pills use `on-canvas`; everywhere else they use `ink`. Avatars show initials on a colour fill rather than stock photos.
