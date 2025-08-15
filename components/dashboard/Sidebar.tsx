'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from './useSidebar'
import { LayoutDashboard, FileText, PenLine, Users, LogOut, ChevronLeft, Menu } from 'lucide-react'
import { signOut } from '@/app/dashboard/actions'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

type Role = 'contributor' | 'editor' | 'chief' | null

export default function Sidebar() {
  const path = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const [role, setRole] = useState<Role>(null)

  // get role for dynamic menu
  useEffect(() => {
    const s = createClient()
    s.rpc('me_role').then(({ data }) => setRole((data as Role) ?? 'contributor'))
  }, [])

  const base = 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
  const active = 'text-white bg-indigo-600 shadow-[0_8px_30px_rgb(99_102_241_/0.25)]'
  const itemClass = (href: string) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
      path === href ? active : 'hover:bg-slate-100 dark:hover:bg-slate-800 ' + base
    }`

  const admin = role === 'editor' || role === 'chief'

  return (
    <>
      {/* mobile backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-30 bg-black/30 lg:hidden transition-opacity ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        className={`fixed z-40 top-0 left-0 h-dvh bg-gradient-to-b from-indigo-600 to-blue-500 text-white
        shadow-xl transition-all duration-300
        ${collapsed ? 'w-[84px]' : 'w-72'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* brand + toggles */}
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
              onClick={() => setMobileOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </button>
            {!collapsed && <span className="font-semibold tracking-wide">Redaksi SMA</span>}
          </div>
          <button
            className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* role badge */}
        <div className={`${collapsed ? 'px-2' : 'px-4'} pb-3`}>
          <div className="rounded-lg bg-white/10 px-3 py-2 text-xs">
            <div className="opacity-80">Role</div>
            <div className="font-medium capitalize">{role ?? '-'}</div>
          </div>
        </div>

        <nav className="px-2 space-y-1">
          <Link href="/dashboard" className={itemClass('/dashboard')}>
            <LayoutDashboard className="h-5 w-5" />
            {!collapsed && <span>Ringkasan</span>}
          </Link>

          <Link href="/dashboard/articles" className={itemClass('/dashboard/articles')}>
            <FileText className="h-5 w-5" />
            {!collapsed && <span>Artikel</span>}
          </Link>

          <Link href="/dashboard/write" className={itemClass('/dashboard/write')}>
            <PenLine className="h-5 w-5" />
            {!collapsed && <span>Tulis Artikel</span>}
          </Link>

          {admin && (
            <Link href="/dashboard/members" className={itemClass('/dashboard/members')}>
              <Users className="h-5 w-5" />
              {!collapsed && <span>Anggota</span>}
            </Link>
          )}

          <button
            onClick={() => signOut()}
            className="mt-2 w-full rounded-xl px-3 py-2 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>
    </>
  )
}
