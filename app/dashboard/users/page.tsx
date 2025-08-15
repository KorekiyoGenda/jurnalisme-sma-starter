'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { updateUserRole } from './server-actions'

type Row = { id: string; full_name: string | null; role: 'contributor'|'editor'|'chief'; created_at: string }

export default function UsersPage() {
  const s = createClient()
  const [meRole, setMeRole] = useState<string>('contributor')
  const [rows, setRows] = useState<Row[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const r = await s.rpc('me_role')
      setMeRole((r.data as string) ?? 'contributor')
      if ((r.data as string) !== 'chief') {
        alert('Halaman ini khusus chief.')
      }
      const { data } = await s.from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: true })
      setRows(data as any || [])
    })()
  }, [s])

  const apply = async (id: string, newRole: Row['role']) => {
    setBusy(id)
    try {
      await updateUserRole(id, newRole)
      setRows(prev => prev.map(r => r.id === id ? { ...r, role: newRole } : r))
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="card">
      <div className="mb-3">
        <h2 className="font-semibold">Anggota & Role</h2>
        <p className="text-sm text-slate-500">Kelola peran anggota (khusus chief). Peran kamu: <b>{meRole}</b></p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2">Nama</th>
              <th className="py-2">UID</th>
              <th className="py-2">Role</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(u => (
              <tr key={u.id} className="align-middle">
                <td className="py-2">{u.full_name ?? '(tanpa nama)'}</td>
                <td className="py-2 text-slate-500">{u.id}</td>
                <td className="py-2">
                  <span className="rounded-full border px-2 py-0.5">{u.role}</span>
                </td>
                <td className="py-2">
                  <div className="flex gap-2">
                    {(['contributor','editor','chief'] as const).map(r => (
                      <button
                        key={r}
                        disabled={busy === u.id || u.role === r}
                        onClick={()=>apply(u.id, r)}
                        className={`btn h-8 ${u.role===r ? 'opacity-50 cursor-default' : ''}`}
                      >
                        {busy===u.id ? '...' : `Jadikan ${r}`}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length===0 && (
              <tr><td className="py-6 text-slate-500" colSpan={4}>Tidak ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
