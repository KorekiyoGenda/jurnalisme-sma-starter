import 'server-only'
import { createClientRSC } from '@/lib/supabase-server'
import type { Role, Viewer } from '@/types/auth'

export async function getViewer(): Promise<Viewer> {
  const s = await createClientRSC()
  const { data: { user } } = await s.auth.getUser()

  if (!user) {
    return {
      isLoggedIn: false,
      role: null,
      canAccessDashboard: false,
      profile: { name: null, username: null, email: null, avatarUrl: null },
    }
  }

  const { data: p } = await s
    .from('profiles')
    .select('full_name, username, avatar_url, role')
    .eq('id', user.id)
    .single()

  const role = (p?.role as Role) ?? 'member'

  let avatarUrl: string | null = null
  if (p?.avatar_url) {
    const { data } = s.storage.from('avatars').getPublicUrl(p.avatar_url)
    avatarUrl = data.publicUrl ?? null
  }

  return {
    isLoggedIn: true,
    role,
    canAccessDashboard: role !== 'member',
    profile: {
      name: p?.full_name ?? null,
      username: p?.username ?? null,
      email: user.email ?? null,
      avatarUrl,
    },
  }
}
