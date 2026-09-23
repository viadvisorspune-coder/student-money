import { useNavigate } from 'react-router-dom'
import { AppBar, Button, CategoryCard, LinkRow, SectionHeader } from '../ui'
import { F } from '../lib/format'
import { AllowanceBar } from '../components/AllowanceBar'
import { CategoryBars } from '../components/CategoryBars'
import { outletOf } from '../state/selectors'
import { useApp } from '../state/AppContext'
import type { NestItem } from '../ui/types'

/**
 * Where it went. Money in vs Spent, then a card per category with its sections
 * nested inside it. Two hues per screen (CLAUDE.md §3) — each card carries its own
 * fixed category colour.
 */
export function WhereItWent() {
  const app = useApp()
  const navigate = useNavigate()

  const split = app.splits()

  return (
    <div className="stack">
      <AppBar eyebrow="September" title="Where it went" onBack={() => navigate(-1)} />

      <AllowanceBar allowance={app.income} spent={app.spent} />

      <SectionHeader onCanvas title="By category" />
      <section className="sm-card surface">
        <CategoryBars rows={split} buckets={app.buckets} txns={app.txns} />
        <p className="hint">{`Tap a category to see the sections inside it. Projected for September: ${F(app.projection())}.`}</p>
      </section>

      <SectionHeader
        onCanvas
        title={'Categories · where it went'}
        action={
          <Button
            variant="light"
            size="sm"
            icon="plus"
            onClick={() =>
              app.setEditBucket({
                id: '',
                name: '',
                icon: 'wallet',
                color: 'sky',
                outlets: [{ id: 'o' + Date.now(), name: '', vendors: [] }],
              })
            }
          >
            New
          </Button>
        }
      />

      {app.buckets.map((bk) => {
        const sums: Record<string, number> = {}
        app.txns.forEach((t) => {
          if (t.income || t.bucket !== bk.id) return
          const o = outletOf(bk, t)
          const k = o ? o.id : '__none'
          sums[k] = (sums[k] || 0) - t.amount
        })

        const items: NestItem[] = bk.outlets.map((o) => ({
          id: o.id,
          label: o.name,
          amount: sums[o.id] || 0,
          caption: o.vendors.join(', '),
        }))
        if (sums.__none) {
          items.push({
            id: '__none',
            label: 'Unlabelled',
            amount: sums.__none,
            caption: 'Vendors not in a section yet',
          })
        }

        return (
          <CategoryCard
            key={bk.id}
            name={bk.name}
            color={bk.color}
            spent={app.spentBy[bk.id] || 0}
            items={items}
            selected={app.nestSel[bk.id] || null}
            onSelect={(id) => app.setNestSel({ ...app.nestSel, [bk.id]: id })}
            onEdit={() => app.setEditBucket(bk)}
          />
        )
      })}

      {app.spentBy.__none ? (
        <LinkRow
          tone="butter"
          title={`${F(app.spentBy.__none)} needs a label`}
          caption="Unknown payments the app could not place"
          onClick={() => navigate('/profile/transactions')}
        />
      ) : null}
    </div>
  )
}
