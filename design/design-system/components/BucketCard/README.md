# BucketCard

A card for one category or goal with a reference figure of the student's own: its name, vendors, a meter and what is left.

- **Consumer provides:** `name`, `value`, `limit`, `caption` (for example the vendors), `icon`, `color`, `goal` (switches the wording to “saved”) and `onEdit`.
- The app sets no limits by itself. Use this only where the student supplied the figure; otherwise use CategoryCard, which just reports the total.
- Going past that figure turns the meter `coral-strong` and shows “₹480 over” with an arrow, so it doesn't rely on colour alone.
