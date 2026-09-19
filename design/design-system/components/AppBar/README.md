# AppBar

The header card for a sub-screen, with a back button, an optional trailing action, an eyebrow and a large title.

- **Consumer provides:** `title`, `eyebrow`, `onBack`, an optional `trailing` node (usually an IconButton) and optional `children` (such as a filter row).
- Sub-screens (Impact, Transactions, Experience) use AppBar and no BottomNav. Tab screens use GreetingHero or their own header card.
