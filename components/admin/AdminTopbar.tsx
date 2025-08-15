// components/admin/AdminTopbar.tsx
import { getViewer } from '@/lib/auth'
import AdminTopbarClient from './AdminTopbar.client'

export default async function AdminTopbar() {
  const viewer = await getViewer()
  return <AdminTopbarClient viewer={viewer} />
}
