'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const run = async () => {
      const code = params.get('code')
      const next = params.get('next') || '/dashboard'
      if (code) {
        const supabase = createClient()
        // tukar ?code= menjadi session; supabase-js akan menyimpan sesi di cookies
        await supabase.auth.exchangeCodeForSession({ code })
        // (opsional) auto-upsert ke profiles jika tabelnya sudah ada
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email || 'User',
            role: 'contributor'
          }, { onConflict: 'id' })
        }
      }
      router.replace(next) // balik ke dashboard
    }
    run()
  }, [params, router])

  return <p className="text-sm text-slate-500">Menyelesaikan login…</p>
}
