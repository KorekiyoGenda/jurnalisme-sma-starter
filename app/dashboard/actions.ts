'use server'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'


export async function signInWithGoogle() {
  const s = createServerClient()
  const { data, error } = await s.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
    },
  })
  if (error) throw error
  return data.url
}

export async function signOut() {
  const s = createServerClient()
  await s.auth.signOut()
  revalidatePath('/dashboard')
}

export async function createDraft(payload: { title: string; summary: string; content: string }) {
  const s = createServerClient()
  const { data: { user } } = await s.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const slug = payload.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const { data, error } = await s.from('articles').insert({
    title: payload.title,
    summary: payload.summary,
    content: payload.content,
    status: 'draft',
    slug,
    author_id: user.id
  }).select('id').single()

  if (error) throw new Error(error.message)
  return data?.id as number
}

export async function submitForReview(id: number) {
  const s = createServerClient()
  const { data: { user } } = await s.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await s.from('articles').update({ status: 'in_review' }).eq('id', id).eq('author_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
}

export async function approveAndPublish(id: number) {
  const s = createServerClient()
  const { data: { user } } = await s.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: me } = await s.from('profiles').select('role').eq('id', user.id).single()
  if (!me || !['editor','chief'].includes(me.role)) throw new Error('Forbidden')
  const { error } = await s.from('articles').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
  revalidatePath('/dashboard')
}