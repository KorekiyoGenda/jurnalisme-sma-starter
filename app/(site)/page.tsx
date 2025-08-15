export const dynamic = 'force-dynamic'
export const revalidate = 0

import { dateID } from '@/lib/date';
import TemplateHome from './page-template'   
import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { ArrowRight, Zap, Users, PenTool, Shield, Rocket, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SectionHeading } from '@/components/SectionHeading'
import { Calendar, BookOpen } from 'lucide-react'
import articlesData from '@/data/articles.json'

type ArticleRow = { id:number; title:string; slug:string; summary:string|null; published_at:string|null }

export default async function HomePage() {
  let articles: ArticleRow[] = []
  try {
    const s = await createServerClient()   
    const { data, error } = await s
    .from('articles')
    .select('id, title, slug, summary, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(12)

  if (error) console.error(error)
  articles = data ?? []
  } catch (e) {
    // Supabase gagal → biarkan articles tetap []
    console.error('home fetch error:', e)
  }

  // ✅ Kalau DB kosong / error → langsung pakai TEMPLATE
  if (articles.length === 0) {
    return <TemplateHome />
  }
  
  const { categories, events } = articlesData
  const featuredArticles = articles.slice(0, 3)
  const recentArticles = articles.slice(3, 6)


  // ✅ Versi Supabase (selalu render konten)
  const features = [
    { icon: PenTool, title: 'Editor Modern', description: 'Rich text editor dengan dukungan media & preview real-time' },
    { icon: Users,   title: 'Kolaborasi Tim', description: 'Workflow editorial: draft → review → publish' },
    { icon: Shield,  title: 'Keamanan Terjamin', description: 'Row Level Security & role-based access' },
    { icon: Rocket,  title: 'Performa Tinggi', description: 'Next.js 14 + Supabase — cepat & efisien' },
  ]
  const publishedCount = articles.length

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {/* <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-muted via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4border-primary/50 text-primary">✨ Ekstrakurikuler Jurnalistik SMA Negeri 7 Surabaya</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Suara Siswa,{' '}
              <span className="text-primary-500">Cerita Sekolah</span>
            </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Inspirasi setiap hari dari kehidupan sekolah, prestasi siswa, dan berbagai kegiatan menarik di SMA Negeri 7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" asChild>
                <Link href="/feed">
                  Lihat Berita Terbaru
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  Tentang Kami
                </Link>
              </Button>
          </div>
        </div>
      </section> */}
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-muted via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              ✨ Ekstrakurikuler Jurnalistik SMA Negeri 7 Surabaya
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Suara Siswa,{' '}
              <span className="text-primary-500">Cerita Sekolah</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Inspirasi setiap hari dari kehidupan sekolah, prestasi siswa, dan berbagai kegiatan menarik di SMA Negeri 7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild>
                <Link href="/feed">
                  Lihat Berita Terbaru
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  Tentang Kami
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Utama (template-style) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Berita Utama" 
            subtitle="Artikel pilihan dan update terbaru dari SMA Negeri 7"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map(a => (
              <Card key={a.id} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">Published</Badge>
                  <Link href={`/articles/${a.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{a.title}</h3>
                  </Link>
                  {a.summary && <p className="text-sm text-muted-foreground line-clamp-3">{a.summary}</p>}
                  <div className="mt-3 text-xs text-muted-foreground">
                    {a.published_at ? dateID.fullLong(a.published_at) : '—'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori Populer (template-style) */}
      <section className="py-16 bg-primary-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Kategori Populer"
            subtitle="Jelajahi berbagai topik menarik"
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0,6).map((c: any) => (
              <Card key={c.id} className="hover:shadow-md transition-all duration-300 group">
                <Link href={`/feed?category=${c.id}`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-500 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{c.description}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading title="Artikel Terbaru" />
            <Button variant="outline" asChild>
              <Link href="/feed">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map(a => (
              <Card key={a.id} className="hover:shadow-md transition">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">Published</Badge>
                  <Link href={`/articles/${a.slug}`}>
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{a.title}</h3>
                  </Link>
                  {a.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{a.summary}</p>}
                  <div className="mt-3 text-xs text-muted-foreground">
                    {a.published_at ? dateID.fullLong(a.published_at) : '—'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Sekolah (template-style) */}
      <section className="py-16 bg-primary-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Agenda Sekolah"
            subtitle="Jangan lewatkan kegiatan menarik yang akan datang"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev: any) => (
              <Card key={ev.id} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-500 text-white rounded-lg p-3 flex-shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{ev.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{dateID.fullLong(ev.date)}</p>
                      <p className="text-sm text-muted-foreground mb-2">📍 {ev.location}</p>
                      <p className="text-sm">{ev.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/events">
                Lihat Semua Event
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA (template-style) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Bergabung dengan Seven Journalism</h2>
            <p className="text-lg text-muted-foreground">
              Tertarik untuk berkontribusi dalam dunia jurnalistik sekolah? 
              Bergabunglah dengan ekstrakurikuler jurnalistik SMA Negeri 7 dan kembangkan bakat menulismu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/about">
                  <Users className="mr-2 h-4 w-4" />
                  Lihat Ekstrakurikuler
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/guidelines">Panduan Menulis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
