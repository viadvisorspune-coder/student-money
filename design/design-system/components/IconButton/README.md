# IconButton

A round, icon-only button for one-tap actions such as open, close, edit, share and mark done.

- **Consumer provides:** `icon`, `label` (required, used as the accessible name) and `onClick`.
- `dark` (ink fill) is the primary action on a card, and a card has only one. `soft` is for secondary actions on `surface`. `light` sits on colour cards. `outline` is a quiet control on colour cards.
- `lg` (56px) goes in a card’s action row, `md` (48px) in headers and `sm` (36px) for badges. Don’t make one smaller than 36px.
