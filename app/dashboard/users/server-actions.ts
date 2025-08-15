'use server'

import { createServerClient } from '@/lib/supabase-server'

type Role = 'member' | 'writer' | 'editor' | 'admin'

export async function setUserRole(userId: string, role: Role) {
  const supabase = await createServerClient() // ✅ wajib await

  // panggil Postgres function (RPC). Sesuaikan arg names dgn function-mu.
  const { error } = await supabase.rpc('set_user_role', {
    user_id: userId,
    new_role: role,
  })

  if (error) throw new Error(error.message)
  return 'ok'
}
