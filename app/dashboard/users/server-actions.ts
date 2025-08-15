'use server'

import { createServerClient } from '@/lib/supabase-server'

export async function updateUserRole(targetId: string, newRole: 'contributor'|'editor'|'chief') {
  const s = createServerClient()
  // panggil RPC yang aman (cek chief di dalam fungsi)
  const { error } = await s.rpc('set_user_role', { target_id: targetId, new_role: newRole })
  if (error) throw new Error(error.message)
}