import { cookies } from 'next/headers'
import { createServerClient as _createServerClient } from '@supabase/ssr'

export async function createClientRSC() {
  const jar = await cookies()
  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => jar.get(name)?.value,
        // 🚫 No-op di RSC agar tidak error
        set: async () => {},
        remove: async () => {},
      },
    }
  )
}

/** Untuk Server Action / Route Handler — BOLEH set/remove cookies */
export async function createClientAction() {
  const jar = await cookies()
  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => jar.get(name)?.value,
        set: async (name: string, value: string, options: any) => {
          jar.set({ name, value, ...options })
        },
        remove: async (name: string, options: any) => {
          jar.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )
}

// Alias lama supaya tidak perlu refactor besar
export const createServerClient = createClientRSC;
export const createClient = createClientRSC;
