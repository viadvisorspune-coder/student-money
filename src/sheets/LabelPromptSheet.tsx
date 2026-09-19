import { useState } from 'react'
import { BottomSheet, Button, FilterChips } from '../ui'
import type { Bucket } from '../data/types'
import type { LabelPrompt } from '../state/AppContext'

interface Props {
  prompt: LabelPrompt | null
  buckets: Bucket[]
  onClose: () => void
  onFile: (bucketId: string, outletId: string, vendor: string) => void
}

/**
 * The labelling prompt. A vendor is only ever filed with the student's say-so, and
 * the prompt can always be dismissed (CLAUDE.md §2.6).
 */
export function LabelPromptSheet({ prompt, buckets, onClose, onFile }: Props) {
  const [form, setForm] = useState({ bucket: prompt?.bucket || '', outlet: '' })

  if (!prompt) return null
  const current = buckets.filter((b) => b.id === form.bucket)[0]

  return (
    <div className="sheet-host">
      <BottomSheet
        open
        onClose={onClose}
        pill="Noticed a pattern"
        title={prompt.vendor}
        subtitle={`You paid this ${prompt.count} times in September`}
        footer={
          <>
            <Button full disabled={!(form.bucket && form.outlet)} onClick={() => onFile(form.bucket, form.outlet, prompt.vendor)}>
              File it here
            </Button>
            <Button full variant="soft" onClick={onClose}>
              Not now
            </Button>
          </>
        }
      >
        <p className="info-body">
          {`Filing it means future payments to ${prompt.vendor} land in the same place by themselves. You can change it any time.`}
        </p>

        <div className="sm-field">
          <span className="l">Category</span>
          <FilterChips
            single
            label="Category"
            value={form.bucket ? [form.bucket] : []}
            onChange={(v) => setForm({ bucket: v[0] || '', outlet: '' })}
            options={buckets.map((b) => ({ value: b.id, label: b.name }))}
          />
        </div>

        {current ? (
          <div className="sm-field">
            <span className="l">Section</span>
            <FilterChips
              single
              label="Section"
              value={form.outlet ? [form.outlet] : []}
              onChange={(v) => setForm({ ...form, outlet: v[0] || '' })}
              options={current.outlets.map((o) => ({ value: o.id, label: o.name }))}
            />
          </div>
        ) : null}
      </BottomSheet>
    </div>
  )
}
