import { useState } from 'react'
import { BottomSheet, Button, Icon, IconButton, TextField } from '../ui'
import type { Bucket } from '../data/types'
import type { Tone } from '../ui/types'

const COLORS: Tone[] = ['coral', 'sky', 'blush', 'sunflower', 'butter', 'grey', 'soft']

interface DraftOutlet {
  id: string
  name: string
  vendors: string[]
  draft: string
}

interface Props {
  bucket: Bucket | null
  onClose: () => void
  onSave: (b: Bucket) => void
  onDelete: (id: string) => void
}

/**
 * Edit category & sections. The student owns the labels: rename, recolour, add or
 * remove sections and vendors, or delete the category outright (CLAUDE.md §2.6).
 * Note what is not here: no limit field of any kind (§2.1).
 */
export function EditBucketSheet({ bucket, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState(() =>
    bucket
      ? {
          name: bucket.name,
          color: bucket.color,
          outlets: bucket.outlets.map<DraftOutlet>((o) => ({
            id: o.id,
            name: o.name,
            vendors: o.vendors.slice(),
            draft: '',
          })),
        }
      : null,
  )

  if (!bucket || !form) return null
  const isNew = !bucket.id
  const valid = !!form.name.trim()

  function setOutlet(id: string, patch: Partial<DraftOutlet>) {
    setForm((f) => (f ? { ...f, outlets: f.outlets.map((o) => (o.id === id ? { ...o, ...patch } : o)) } : f))
  }

  function addVendor(o: DraftOutlet) {
    const v = o.draft.trim()
    if (!v) return
    setOutlet(o.id, { vendors: o.vendors.indexOf(v) < 0 ? o.vendors.concat([v]) : o.vendors, draft: '' })
  }

  function save() {
    if (!form) return
    onSave({
      ...bucket!,
      id: bucket!.id || 'b' + Date.now(),
      name: form.name.trim(),
      color: form.color,
      outlets: form.outlets
        .filter((o) => o.name.trim() || o.vendors.length)
        .map((o) => ({ id: o.id, name: o.name.trim() || 'Untitled section', vendors: o.vendors })),
    })
  }

  return (
    <div className="sheet-host">
      <BottomSheet
        open
        onClose={onClose}
        pill={isNew ? 'New category' : 'Edit category'}
        title={form.name || 'Untitled category'}
        subtitle="Sections split a category by where you spend"
        trailing={
          isNew ? undefined : <IconButton icon="trash" label="Delete category" onClick={() => onDelete(bucket.id)} />
        }
        footer={
          <Button full disabled={!valid} onClick={save}>
            {isNew ? 'Create category' : 'Save category'}
          </Button>
        }
      >
        <TextField
          id="bucket-name"
          label="Category name"
          value={form.name}
          placeholder="e.g. Eating"
          onChange={(v) => setForm((f) => (f ? { ...f, name: v } : f))}
        />

        <div className="sm-field">
          <span className="l">Colour</span>
          <div className="swatches" role="group" aria-label="Category colour">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={'swatch t-' + c}
                aria-pressed={form.color === c}
                aria-label={c}
                onClick={() => setForm((f) => (f ? { ...f, color: c } : f))}
              >
                {form.color === c ? <Icon name="check" size={16} /> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="sm-field">
          <span className="l">{'Sections · ' + form.outlets.length}</span>
          <div className="outlets">
            {form.outlets.map((o, i) => (
              <div key={o.id} className="outlet">
                <div className="outlet-head">
                  <div style={{ flex: 1 }}>
                    <TextField
                      id={'sec-' + o.id}
                      label={'Section ' + (i + 1)}
                      value={o.name}
                      placeholder="e.g. Cafés"
                      onChange={(v) => setOutlet(o.id, { name: v })}
                    />
                  </div>
                  <IconButton
                    icon="close"
                    size="sm"
                    variant="light"
                    label={'Remove section ' + (o.name || i + 1)}
                    onClick={() => setForm((f) => (f ? { ...f, outlets: f.outlets.filter((x) => x.id !== o.id) } : f))}
                  />
                </div>

                <div className="vendors">
                  {o.vendors.length ? (
                    o.vendors.map((v) => (
                      <span key={v} className="sm-chip light vendor">
                        {v}
                        <button
                          type="button"
                          aria-label={'Remove ' + v}
                          onClick={() => setOutlet(o.id, { vendors: o.vendors.filter((x) => x !== v) })}
                        >
                          <Icon name="close" size={14} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="muted">No vendors yet</p>
                  )}
                </div>

                <form
                  className="addv"
                  onSubmit={(e) => {
                    e.preventDefault()
                    addVendor(o)
                  }}
                >
                  <input
                    className="addv-input"
                    id={'vendor-' + o.id}
                    aria-label={'Add a vendor to ' + (o.name || 'this section')}
                    placeholder="Add a vendor"
                    value={o.draft}
                    onChange={(e) => setOutlet(o.id, { draft: e.target.value })}
                  />
                  <Button type="submit" variant="dark" size="sm" icon="plus">
                    Add
                  </Button>
                </form>
              </div>
            ))}
          </div>

          <Button
            variant="soft"
            icon="plus"
            onClick={() =>
              setForm((f) =>
                f ? { ...f, outlets: f.outlets.concat([{ id: 'o' + Date.now(), name: '', vendors: [], draft: '' }]) } : f,
              )
            }
          >
            Add section
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}
