/**
 * Assumptions.
 *
 * Every number in this app is either a transaction amount from `seed.ts` or is
 * derived from one by an algorithm in `state/selectors.ts`. The handful of inputs
 * that are neither — an opening balance, a threshold, a rounding step — live here,
 * so that a reviewer can see the whole set of assumptions on one screen and a
 * later build can replace them with real data one constant at a time.
 *
 * Full statement of each algorithm, with worked examples: docs/ALGORITHMS.md
 *
 * None of these is a limit, a cap or a budget. They are thresholds for *describing*
 * what happened, never for judging it (design/CLAUDE.md §2.1, §2.3).
 */

/* ------------------------------------------------------------------- ledger */

/**
 * Balance carried into September, before this month's first transaction.
 *
 * ASSUMED. Nothing in the handoff states it; it exists only so the Profile screen
 * can show an account balance. It feeds `balance` and nothing else — no share, no
 * projection and no pattern reads it. Replace with the real opening balance.
 */
export const OPENING_BALANCE = 15_000

/**
 * Total spent in August, used as the comparison period in Experience → Monthly.
 *
 * ASSUMED. The demo data covers September only, so there is no August to total.
 * Chosen to sit below September's month-to-date (₹10,057), which is what produces
 * the "31% more than August (so far)" reading. Replace with the real August total,
 * or compute it once more than one month of transactions exists.
 */
export const PREVIOUS_MONTH_SPEND = 7_650

/* -------------------------------------------------------------------- dates */

/**
 * The date shown on Home.
 *
 * CARRIED OVER FROM THE PROTOTYPE, AND IT DOES NOT AGREE WITH `TODAY` (17).
 * 17 September 2026 is a Thursday; 18 September is the Friday. The prototype prints
 * this string on Home while every computed figure, the "Today" row label and the
 * Profile footnote all use day 17. The brief (§1) says "~₹10,057 spent by the 18th",
 * which matches this string rather than `TODAY`.
 *
 * Held here unchanged so the approved screen is not altered on a guess. Resolving it
 * is a question for the client: either the display date becomes 17 September, or
 * `TODAY` becomes 18 — and 18 changes the daily rate, the projection and every
 * share. See docs/ALGORITHMS.md §8.
 */
export const DISPLAY_DATE = 'Friday, 18 September'

/* --------------------------------------------------------------- thresholds */

/** Quick-amount chips on the Estimate screen. Common student spends, not limits. */
export const QUICK_AMOUNTS = [200, 500, 1000, 2000]

/**
 * How many payments to one vendor in a month before the app offers to file it.
 * ASSUMED. Three is low enough to catch a habit inside one month and high enough
 * that a one-off pair of payments does not trigger a prompt.
 */
export const FREQUENT_VENDOR_MIN_COUNT = 3

/**
 * The ceiling for the "small outings add up" pattern.
 * ASSUMED. A spend at or under this is one the student would not think twice about
 * on its own, which is the whole point of totalling them.
 */
export const SMALL_OUTING_MAX = 400

/**
 * The fewest observations on *each* side of a split before a comparison is shown.
 *
 * ASSUMED, AND NEW — the prototype has no such rule. Without it the weekday/weekend
 * pattern reports a weekend average drawn from a single outing (see
 * docs/ALGORITHMS.md §6.3). Set this to 1 to restore the prototype's behaviour
 * exactly.
 */
export const MIN_PATTERN_SAMPLE = 3

/**
 * How far back the notification cue looks when it quotes "the last N Fridays".
 * ASSUMED. Three keeps the cue inside the current month for most of the month.
 */
export const CUE_LOOKBACK_OCCURRENCES = 3

/* ------------------------------------------------------- presentation rules */

/**
 * The projection is rounded to the nearest ₹10 before it is shown.
 * It is an assumption about the rest of the month, and rounding keeps it from
 * reading as a precise forecast (design/CLAUDE.md §7, and the "at this pace"
 * glossary entry).
 */
export const PROJECTION_ROUNDING = 10

/** Categories shown individually in a share list; the remainder folds into "Other". */
export const SPLIT_TOP_N = 3

/** Blocks shown in a nested breakdown; the remainder folds into "Other". */
export const NEST_MAX_LEVELS = 4
