# NestedBreakdown

Nested blocks that split one amount into sections, largest outside and smaller ones tucked into the bottom-right corner, each labelled with its value.

- **Consumer provides:** `items` (`id`, `label`, `amount`, optional `display` and `tone`), `color` (the category colour, used for the outer block), and optionally `selected`, `onSelect`, `height` (default 280), `maxLevels` (default 4; extra sections fold into “Other”) and `showPercent`.
- Block sizes follow each section's share, with a minimum step between levels so every label stays readable. Treat it as a picture of proportions and always pair it with a legend that prints exact amounts (CategoryCard does this).
- Tones after the outer block follow a fixed ramp (butter, sky, soft, coral), skipping the outer colour and, for warm yellow categories, the other yellow, so neighbouring blocks never look alike.
