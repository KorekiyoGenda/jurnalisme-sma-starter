'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { createDraft, submitForReview } from '../actions'

export default function WritePage() {
  const s = createClient()
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ title: '', summary: '', content: '' })
  const [saving, setSaving] = useState(false)
  const [lastId, setLastId] = useState<number | null>(null)

  useEffect(() => {
    s.auth.getUser().then(({ data }) => setUser(data.user))
  }, [s])

  const canSave = form.title.trim().length >= 3 && form.summary.trim().length >= 5 && form.content.trim().length >= 10

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-semibold mb-3">Tulis Artikel</h2>
        <div className="grid gap-3">
          <input className="input" placeholder="Judul" value={form.title} onChange={e=>setForm({...form, title: e.target.value})}/>
          <input className="input" placeholder="Ringkasan" value={form.summary} onChange={e=>setForm({...form, summary: e.target.value})}/>
          <textarea className="input h-56" placeholder="Konten (HTML/Markdown sederhana)" value={form.content} onChange={e=>setForm({...form, content: e.target.value})}/>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Simpan dulu sebagai draf, lalu kirim ke editor.</p>
            <div className="flex gap-2">
              <button className="btn btn-primary disabled:opacity-50" disabled={!canSave || saving} onClick={async()=>{
                setSaving(true)
                const id = await createDraft(form)
                setSaving(false)
                setLastId(id ?? null)
              }}>{saving ? 'Menyimpan…' : 'Simpan Draf'}</button>

              {lastId && (
                <button className="btn" onClick={async()=>{
                  await submitForReview(lastId)
                  alert('Dikirim ke review')
                }}>Submit for Review</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-500">Login sebagai: {user?.email}</div>
    </div>
  )
}
