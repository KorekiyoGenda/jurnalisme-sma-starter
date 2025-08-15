// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    (async () => {
      const code = params.get('code')
      const next = params.get('next') ?? '/dashboard'

      if (code) {
        const supabase = createClient()

        // ⚠️ Wajib: kirim STRING, bukan object
        await supabase.auth.exchangeCodeForSession(code)

        // (opsional) upsert profile — aman-kan dari RLS & enum
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            await supabase.from('profiles').upsert(
              {
                id: user.id,
                full_name: user.user_metadata?.full_name ?? user.email ?? 'User',
                // biarkan role di-set default/oleh admin. Jangan pakai 'contributor' (tidak ada di enum).
                // role: 'member', // kalau mau paksa isi, pastikan enum kamu ada 'member'
              },
              { onConflict: 'id' }
            )
          }
        } catch {
          // abaikan error kalau RLS menolak; admin nanti yang melengkapi.
        }
      }

      router.replace(next)
    })()
  }, [params, router])

  return <p className="text-sm text-slate-500">Menyelesaikan login…</p>
}
