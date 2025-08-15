// app/settings/profile/page.tsx
import { getViewer } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import AvatarUploader from './AvatarUploader'

// Username 3–20, huruf/angka/underscore (selaras dengan constraint DB)
const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/

export default async function ProfilePage() {
  const viewer = await getViewer()
  if (!viewer.isLoggedIn) redirect('/login')

  // Server Action (dipanggil otomatis saat form submit)
  async function save(formData: FormData) {
    'use server'
    const { createClientRSC } = await import('@/lib/supabase-server')
    const s = await createClientRSC()

    const { data: { user } } = await s.auth.getUser()
    if (!user) redirect('/login')

    const full_name = (formData.get('full_name') || '').toString().trim() || null
    const username  = (formData.get('username')  || '').toString().trim() || null
    const avatar    = formData.get('avatar') as File | null

    // Validasi username (opsional karena DB sudah punya constraint)
    if (username && !USERNAME_RE.test(username)) {
      return { ok: false, message: 'Username hanya huruf/angka/underscore (3–20).' }
    }

    // Cek duplikasi username (kecuali milik sendiri)
    if (username) {
      const { data: exists } = await s
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .maybeSingle()

      if (exists) {
        return { ok: false, message: 'Username sudah dipakai.' }
      }
    }

    // Upload avatar (opsional)
    let avatar_path: string | null = null
    if (avatar && avatar.size > 0) {
      const ext  = (avatar.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: upErr } = await s
        .storage
        .from('avatars')
        .upload(path, avatar, {
          upsert: true,
          contentType: avatar.type || 'image/jpeg',
        })

      if (upErr) {
        return { ok: false, message: 'Gagal upload avatar.' }
      }

      avatar_path = path
    }

    // Build payload update
    const update: Record<string, any> = {}
    if (full_name !== undefined) update.full_name = full_name
    if (username  !== undefined) update.username  = username
    if (avatar_path)               update.avatar_url = avatar_path

    const { error } = await s.from('profiles').update(update).eq('id', user.id)
    if (error) {
      return { ok: false, message: 'Gagal menyimpan profil.' }
    }

    // Refresh data navbar + halaman profile
    revalidatePath('/')
    revalidatePath('/settings/profile')

    return { ok: true }
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-4">Ubah nama & username</h1>

      <Card className="p-6 space-y-6">
        <form action={save} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <AvatarUploader initialUrl={viewer.profile.avatarUrl || undefined} />
          </div>

          {/* Full name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Nama lengkap</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={viewer.profile.name ?? ''}
              placeholder="Nama kamu"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={viewer.profile.username ?? ''}
              placeholder="mis. korekiyo_genda"
              pattern="[A-Za-z0-9_]{3,20}"
              title="3–20 karakter, huruf/angka/underscore"
            />
            <p className="text-xs text-muted-foreground">
              3–20 karakter, huruf/angka/underscore. Ditampilkan sebagai <code>@username</code>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
