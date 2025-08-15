'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useAdminStore } from '@/lib/store'

export default function AdminShell({
  children,
  topbar,
}: {
  children: React.ReactNode
  topbar: React.ReactNode            // server component diterima sebagai prop OK
}) {
  const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed)

  return (
    <div className="theme-admin flex h-screen bg-background text-foreground">
      <AdminSidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {topbar}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
