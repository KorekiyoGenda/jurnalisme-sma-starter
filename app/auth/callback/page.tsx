'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const run = async () => {
      const code = params.get('code')
      const next = params.get('next') || '/dashboard'

      if (code) {
        const supabase = createClient()

        // Tukar code -> session (supabase-js akan simpan di cookies)
        await supabase.auth.exchangeCodeForSession(code)

        // (Opsional) upsert ke profiles sesuai schema kamu
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').upsert(
            {
              id: user.id,
              name: user.user_metadata?.full_name || user.email || 'User',
              avatar_url: user.user_metadata?.avatar_url ?? null,
              // role: (biarkan default 'reader' dari DB)
            },
            { onConflict: 'id' }
          )
        }
      }

      router.replace(next)
    }
    run()
  }, [params, router])

  return <p className="text-sm text-slate-500">Menyelesaikan login…</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Menyelesaikan login…</p>}>
      <CallbackInner />
    </Suspense>
  )
}

// Hindari prerender statis di halaman ini (opsional tapi aman)
export const dynamic = 'force-dynamic'
