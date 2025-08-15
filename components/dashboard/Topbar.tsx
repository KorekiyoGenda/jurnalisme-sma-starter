'use client'

import { Bell, Search } from 'lucide-react'

export default function Topbar({ email, role }:{ email?:string|null; role?:string|null }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="relative hidden w-80 md:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="Cari artikel…"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <Bell size={18} />
          </button>
          <div className="rounded-xl border bg-white px-3 py-1.5 text-xs text-slate-600">
            <div className="font-medium">{email ?? '—'}</div>
            <div className="text-[10px] capitalize text-slate-400">{role ?? ''}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
