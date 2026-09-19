# TransactionRow

One transaction in a list: a bucket badge, vendor, bucket and time, and a signed amount.

- **Consumer provides:** `vendor`, `amount` (negative for money out), `bucket`, `time`, `icon`, `tone` (the bucket colour) and `onClick` (opens the transaction detail).
- Group rows under date labels. Don't put them in a table: three columns don't fit at phone width.
