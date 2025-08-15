'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase-client'
import { updateUserRole, type Role } from './server-actions'

type Row = {
  id: string
  full_name: string | null
  role: Role
  created_at: string
}

const ALL_ROLES: Role[] = ['member', 'writer', 'editor', 'admin']

export default function UsersPage() {
  const supabase = createClient()
  const [meRole, setMeRole] = useState<Role | 'unknown'>('unknown')
  const [meId, setMeId] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [pending, start] = useTransition()

  useEffect(() => {
    (async () => {
      // ambil user & role-nya
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Harus login.')
        return
      }
      setMeId(user.id)

      // role-ku (aman dengan RLS: policy self_read)
      const { data: me } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const myRole = (me?.role ?? 'member') as Role
      setMeRole(myRole)

      // hanya admin yang boleh lihat semua profil (sesuai policy: is_admin())
      if (myRole !== 'admin') {
        alert('Halaman ini khusus admin.')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: true })

      setRows((data ?? []) as Row[])
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const apply = (id: string, newRole: Role) => {
    setBusyId(id)
    start(async () => {
      try {
        await updateUserRole(id, newRole)
        setRows(prev => prev.map(r => (r.id === id ? { ...r, role: newRole } : r)))
      } finally {
        setBusyId(null)
      }
    })
  }

  return (
    <section className="card p-4 md:p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-lg">Anggota & Role</h2>
        <p className="text-sm text-slate-500">
          Kelola peran anggota (khusus admin). Peran kamu: <b>{meRole}</b>
        </p>
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
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map(r => (
                      <button
                        key={r}
                        disabled={
                          pending || busyId === u.id || u.role === r || u.id === meId /* jangan ubah diri sendiri */
                        }
                        onClick={() => apply(u.id, r)}
                        className={`btn h-8 px-3 ${
                          u.role === r ? 'opacity-50 cursor-default' : ''
                        }`}
                        title={u.id === meId ? 'Tidak bisa ubah role diri sendiri' : `Jadikan ${r}`}
                      >
                        {busyId === u.id ? '...' : `Jadikan ${r}`}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="py-6 text-slate-500" colSpan={4}>
                  {meRole === 'admin'
                    ? 'Tidak ada data.'
                    : 'Kamu bukan admin; daftar anggota tidak ditampilkan.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
