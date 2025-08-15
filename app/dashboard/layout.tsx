import AdminTopbar from '@/components/admin/AdminTopbar' 
import AdminShell from './AdminShell.client'                   

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell topbar={<AdminTopbar />}>
      {children}
    </AdminShell>
  )
}
