// app/about/page.tsx
import { createServerClient } from '@/lib/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeading } from '@/components/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Mail, Phone, MapPin } from 'lucide-react'

type TeamRow = {
  id: string
  full_name: string
  job_title: string | null
  cohort: string | null
  status: 'active' | 'alumni' | string
}

const FALLBACK_TEAM: Array<{name:string; role:string; description:string}> = [
  { name: 'Bu Sarah Wijaya', role: 'Pembina Eskul Jurnalistik', description: 'Guru Bahasa Indonesia dengan pengalaman 10 tahun.' },
  { name: 'Ahmad Rizki', role: 'Ketua Redaksi', description: 'Siswa kelas 11 IPA; tertarik jurnalistik & fotografi.' },
  { name: 'Siti Nurhaliza', role: 'Editor', description: 'Siswa kelas 11 IPS; fokus editing & layouting.' },
  { name: 'Budi Santoso', role: 'Reporter Senior', description: 'Siswa kelas 12 IPA; aktif meliput kegiatan sekolah.' },
]

const ACHIEVEMENTS = [
  'Juara 1 Lomba Jurnalistik Siswa Tingkat Provinsi 2024',
  'Juara 2 Kompetisi Fotografi Sekolah Nasional 2024',
  'Penghargaan Sekolah Terbaik dalam Literasi Digital 2023',
  'Juara 3 Festival Film Pendek Siswa 2023',
]

export default async function AboutPage() {
  // 1) Coba ambil data dari Supabase (aman walau view belum ada)
  let team: TeamRow[] | null = null
  try {
    const s = createServerClient()
    const { data } = await s.from('v_team_public').select('*')
    team = data as TeamRow[] | null
  } catch (_) {
    team = null
  }

  const active = (team ?? []).filter(t => t.status === 'active')
  const old = (team ?? []).filter(t => t.status !== 'active' && t.status !== null)

  const useFallback = !team || team.length === 0

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="SEVEN JOURNALISM"
          subtitle="Mengenal lebih dekat dengan kegiatan jurnalistik SMA Negeri 7"
          className="mb-16"
        />

        {/* About Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Profil Ekstrakurikuler</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Ekstrakurikuler Jurnalistik SMA Negeri 7 berdiri sejak tahun 2010 dengan tujuan mengembangkan kemampuan menulis, fotografi, videografi dan jurnalistik siswa. Kami berkomitmen untuk menjadi wadah kreativitas siswa dalam mengekspresikan ide dan pemikiran mereka.</p>
                <p>Melalui berbagai kegiatan seperti pelatihan menulis, workshop fotografi & videografi, dan peliputan event sekolah, kami berusaha menciptakan generasi muda yang kritis, kreatif, dan mampu berkomunikasi dengan baik.</p>
                <p>Tim jurnalistik kami terdiri dari siswa-siswa yang passionate dan berdedikasi tinggi, didampingi oleh pembina yang berpengalaman dalam dunia pendidikan dan jurnalistik.</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">20+</div>
                    <p className="text-sm text-muted-foreground">Anggota Aktif</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">5+</div>
                      <p className="text-xs text-muted-foreground">Artikel Published</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">15</div>
                      <p className="text-xs text-muted-foreground">Tahun Berdiri</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" /> Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menjadi ekstrakurikuler jurnalistik terdepan...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" /> Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Mengembangkan kemampuan menulis dan jurnalistik siswa</li>
                  <li>• Memberikan platform untuk kreativitas</li>
                  <li>• Melatih berpikir kritis & analitis</li>
                  <li>• Membangun karakter yang etis</li>
                  <li>• Menjadi jembatan informasi sekolah-siswa</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <SectionHeading
            title="Tim Redaksi"
            subtitle={useFallback ? 'Contoh struktur tim (placeholder)' : 'Anggota aktif & arsip alumni'}
            className="mb-12"
          />

          {useFallback ? (
            // === TEMPLATE (tanpa DB) ===
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FALLBACK_TEAM.map((m, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{m.name}</h3>
                    <Badge variant="secondary" className="mb-3">{m.role}</Badge>
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // === DATA DARI SUPABASE ===
            <div className="space-y-10">
              <div>
                <h3 className="font-semibold mb-3">Active Team</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {active.map(m => (
                    <Card key={m.id}><CardContent className="p-4">
                      <div className="text-sm text-slate-500">{m.cohort}</div>
                      <div className="font-medium">{m.full_name}</div>
                      <div className="text-sm">{m.job_title}</div>
                    </CardContent></Card>
                  ))}
                  {active.length === 0 && <p className="text-sm text-slate-500">Belum ada data.</p>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Old Team</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {old.map(m => (
                    <Card key={m.id}><CardContent className="p-4">
                      <div className="badge">Alumni</div>
                      <div className="text-sm text-slate-500">{m.cohort}</div>
                      <div className="font-medium">{m.full_name}</div>
                      <div className="text-sm">{m.job_title}</div>
                    </CardContent></Card>
                  ))}
                  {old.length === 0 && <p className="text-sm text-slate-500">Belum ada data.</p>}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <SectionHeading title="Prestasi & Pencapaian" subtitle="Beberapa capaian kami" className="mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((a, i) => (
              <Card key={i}><CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <p className="text-sm">{a}</p>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <SectionHeading title="Kontak & Informasi" subtitle="Hubungi kami" className="mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card><CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground text-sm">jurnalistik.sman7@education.id</p>
            </CardContent></Card>
            <Card><CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Telepon</h3>
              <p className="text-muted-foreground text-sm">(021) 123-4567</p>
            </CardContent></Card>
            <Card><CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Alamat</h3>
              <p className="text-muted-foreground text-sm">SMA Negeri 7, Jalan Ngaglik 27-29, Surabaya</p>
            </CardContent></Card>
          </div>
        </section>
      </div>
    </div>
  )
}
