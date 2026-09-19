import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BottomNav } from '../ui'
import { cx } from '../lib/cx'
import { useApp } from '../state/AppContext'
import { AddTxnSheet } from '../sheets/AddTxnSheet'
import { EditBucketSheet } from '../sheets/EditBucketSheet'
import { InfoSheet } from '../sheets/InfoSheet'
import { LabelPromptSheet } from '../sheets/LabelPromptSheet'
import { TxnSheet } from '../sheets/TxnSheet'

/** Bottom nav is Home, Plans, Profile in that order, labels always visible (CLAUDE.md §6). */
const NAV = [
  { id: 'home', icon: 'home' as const, label: 'Home' },
  { id: 'plans', icon: 'grid' as const, label: 'Plans' },
  { id: 'profile', icon: 'user' as const, label: 'Profile' },
]

const TAB_PATH: Record<string, string> = { home: '/', plans: '/plans', profile: '/profile' }

/** Which tab a route belongs to, so a screen inside a flow keeps its tab lit. */
function tabOf(pathname: string): string {
  if (pathname.startsWith('/plans')) return 'plans'
  if (pathname.startsWith('/profile')) return 'profile'
  return 'home'
}

/** The Phase 2 screens render without the nav (CLAUDE.md §6). */
const NO_NAV = ['/cue', '/widget', '/onboarding', '/empty']

export function Shell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const app = useApp()
  const scroller = useRef<HTMLElement>(null)

  const showNav = !NO_NAV.some((p) => pathname.startsWith(p))

  // Every screen opens at the top, as in the prototype.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0
  }, [pathname])

  const openTxnObj = app.openTxn ? app.txns.filter((t) => t.id === app.openTxn)[0] : undefined

  return (
    <div className="phone">
      <div className="status" aria-hidden>
        <span>9:41</span>
        <span className="island" />
        <span>5G &#9646;</span>
      </div>

      <main className={cx('scroll', showNav && 'has-nav')} ref={scroller}>
        <Outlet />
      </main>

      {showNav ? (
        <div className="navwrap">
          <BottomNav
            showLabels
            items={NAV}
            active={tabOf(pathname)}
            onChange={(id) => navigate(TAB_PATH[id])}
          />
        </div>
      ) : null}

      {/* Overlays live at the shell so they survive navigation within a flow. */}
      <EditBucketSheet
        key={app.editBucket ? app.editBucket.id || 'new' : 'no-bucket'}
        bucket={app.editBucket}
        onClose={() => app.setEditBucket(null)}
        onSave={app.saveBucket}
        onDelete={app.deleteBucket}
      />

      <TxnSheet
        key={app.openTxn || 'no-txn'}
        txn={openTxnObj}
        buckets={app.buckets}
        resolve={app.resolve}
        onClose={() => app.setOpenTxn(null)}
        onSave={app.saveTxn}
      />

      <InfoSheet term={app.info} onClose={() => app.setInfo(null)} />

      <AddTxnSheet
        key={app.addOpen ? 'add' : 'no-add'}
        open={app.addOpen}
        buckets={app.buckets}
        onClose={() => app.setAdd(false)}
        onAdd={app.addTxn}
      />

      <LabelPromptSheet
        key={app.labelPrompt ? app.labelPrompt.vendor : 'no-label'}
        prompt={app.labelPrompt}
        buckets={app.buckets}
        onClose={() => app.setLabelPrompt(null)}
        onFile={app.fileVendor}
      />

      {app.toast ? (
        <div className="toast" role="status">
          <span>{app.toast.message}</span>
          {app.toast.undo ? (
            <button
              type="button"
              onClick={() => {
                app.toast?.undo?.()
                app.dismissToast()
              }}
            >
              Undo
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
