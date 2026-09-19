import { useState } from 'react'
import { BottomSheet, Button } from '../ui'
import { useApp } from '../state/AppContext'

/**
 * What the app holds, and how to clear it.
 *
 * CLAUDE.md §2.9 requires the Profile screen to explain what is read and how to edit
 * or clear it. The approved design covers the explaining; this covers the clearing,
 * which had no control anywhere. It is built entirely from existing design-system
 * components so it reads as part of the app rather than an addition to it.
 *
 * Clearing is destructive and asks a second time before doing anything. The wording
 * states what happens and stops — no warning colour, no scolding (§2.3, §2.8).
 */
export function DataSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const app = useApp()
  const [confirming, setConfirming] = useState(false)

  if (!open) return null

  const payments = app.txns.length
  const categories = app.buckets.length
  const sections = app.buckets.reduce((a, b) => a + b.outlets.length, 0)
  const plans = app.plans.length

  return (
    <div className="sheet-host">
      <BottomSheet
        open
        onClose={() => {
          setConfirming(false)
          onClose()
        }}
        pill="On this phone"
        title={confirming ? 'Clear everything?' : 'What the app holds'}
        subtitle={
          confirming
            ? 'This cannot be undone'
            : 'All of it is on this phone. None of it has been sent anywhere.'
        }
        footer={
          confirming ? (
            <>
              <Button
                full
                variant="danger"
                icon="trash"
                onClick={() => {
                  app.reset()
                  setConfirming(false)
                  onClose()
                }}
              >
                Yes, clear it
              </Button>
              <Button full variant="soft" onClick={() => setConfirming(false)}>
                Keep my data
              </Button>
            </>
          ) : (
            <Button full variant="soft" icon="trash" onClick={() => setConfirming(true)}>
              Clear everything
            </Button>
          )
        }
      >
        {confirming ? (
          <p className="info-body">
            Your {payments} payments, {categories} categories and {plans} plans will be removed from this phone, and
            the demo month put back in their place.
          </p>
        ) : (
          <>
            <dl className="sm-parts">
              <div>
                <dt>Payments</dt>
                <dd>{payments}</dd>
              </div>
              <div>
                <dt>Categories</dt>
                <dd>{categories}</dd>
              </div>
              <div>
                <dt>Sections inside them</dt>
                <dd>{sections}</dd>
              </div>
              <div>
                <dt>Plans</dt>
                <dd>{plans}</dd>
              </div>
            </dl>
            <p className="hint-s">
              The app reads the remark and the amount on a payment. You decide what each one was for, and you can
              rewrite any of it from the transaction list.
            </p>
          </>
        )}
      </BottomSheet>
    </div>
  )
}
