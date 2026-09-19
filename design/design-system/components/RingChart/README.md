# RingChart

Concentric progress rings on a dark card, one ring per measure: budget at a glance, or spend per bucket.

- **Consumer provides:** `rings` (`label`, `value`, `max`, `tone`, `display`), `title`, and optional `centerValue`/`centerLabel` (shown only with three rings or fewer) and `onClick`.
- Rings thin as they multiply: up to three rings are thick with a centre figure, four or five are thinner, and six or more thinner still. Past eight, group the smallest into “Other”.
- Keep bucket tones consistent across the app. The legend always prints the values, so no one has to read the arcs to get the numbers.
- When the card is clickable, don't put a button in `trailing`; use a plain icon instead.
