import { getViewer } from '@/lib/auth'
import TopNavClient from './TopNav.client'

export default async function TopNav() {
  const viewer = await getViewer()
  return (
    <TopNavClient
      isLoggedIn={viewer.isLoggedIn}
      canAccessDashboard={viewer.canAccessDashboard}
      profile={viewer.profile}
      role={viewer.role}                
    />
  )
}
