// app/dashboard/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'

// helper kecil untuk resolve origin (Preview/Prod/Local)
function resolveOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  )
}

export async function signInWithGoogle() {
  const supabase = await createServerClient() // ✅ Wajib await

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${resolveOrigin()}/auth/callback?next=/dashboard`,
    },
  })
  if (error) throw new Error(error.message)
  return data?.url ?? null
}

export async function signOut() {
  const supabase = await createServerClient() // ✅
  await supabase.auth.signOut()
  revalidatePath('/dashboard')
}

type DraftPayload = {
  title: string
  summary?: string
  content?: any            // tiptap JSON atau string
  category_id?: number | null
}

export async function createDraft(payload: DraftPayload) {
  const supabase = await createServerClient() // ✅
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const baseSlug = payload.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // pastikan slug unik sederhana
  let slug = baseSlug
  for (let i = 1; i < 10; i++) {
    const { data: exists } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!exists) break
    slug = `${baseSlug}-${i}`
  }

  // normalisasi content → tiptap JSON
  const content =
    typeof payload.content === 'string'
      ? {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: payload.content }] }],
        }
      : payload.content ?? { type: 'doc', content: [] }

  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: payload.title,
      summary: payload.summary ?? null,
      content, // ✅ jsonb
      status: 'draft',
      slug,
      author_id: user.id,
      category_id: payload.category_id ?? null,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data.id as number
}

export async function submitForReview(id: number) {
  const supabase = await createServerClient() // ✅
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('articles')
    .update({ status: 'in_review' })
    .eq('id', id)
    .eq('author_id', user.id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}

export async function approveAndPublish(id: number) {
  const supabase = await createServerClient() // ✅
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: me } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  // ✅ enum kita: member|writer|editor|admin (tidak ada 'chief')
  if (!me || !['editor', 'admin'].includes(me.role)) throw new Error('Forbidden')

  const { error } = await supabase
    .from('articles')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
}
