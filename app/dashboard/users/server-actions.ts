'use server'

import { createServerClient } from '@/lib/supabase-server'

// enum yang valid di DB kamu
export type Role = 'member' | 'writer' | 'editor' | 'admin'

// 🔴 WAJIB: named export, dan await client
export async function updateUserRole(userId: string, newRole: Role) {
  const supabase = await createServerClient()

  const { error } = await supabase.rpc('set_user_role', {
    user_id: userId,   // samakan dengan argumen function di DB
    new_role: newRole,
  })

  if (error) throw new Error(error.message)
  return 'ok'
}
