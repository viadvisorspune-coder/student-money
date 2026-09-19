import { BottomSheet, Button } from '../ui'
import { TERMS, type TermKey } from '../data/terms'

export function InfoSheet({ term, onClose }: { term: TermKey | null; onClose: () => void }) {
  if (!term) return null
  const t = TERMS[term]

  return (
    <div className="sheet-host">
      <BottomSheet
        open
        onClose={onClose}
        pill="In plain words"
        title={t.title}
        footer={
          <Button full onClick={onClose}>
            Got it
          </Button>
        }
      >
        <p className="info-body">{t.body}</p>
      </BottomSheet>
    </div>
  )
}
