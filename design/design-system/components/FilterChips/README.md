# FilterChips

Chips that switch on and off independently (click to select, click again to clear), such as incoming and outgoing.

- **Consumer provides:** `options` (`value`, `label`, optional `count`), plus `value` with `onChange`, or `defaultValue`. Pass `single` to allow at most one selection, for example when picking a bucket.
- Selected chips show a check icon as well as the dark fill.
- For switching between views, use SegmentedToggle instead.
