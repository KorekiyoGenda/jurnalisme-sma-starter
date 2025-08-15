// app/articles/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArticleCard } from '@/components/ArticleCard'
import { Separator } from '@/components/ui/separator'
import { dateID } from '@/lib/date';

// fallback data (template)
import articlesData from '@/data/articles.json'

type DbArticle = {
  id: string
  slug: string
  title: string
  cover?: string | null
  content?: string | null
  summary?: string | null
  category?: string | null
  author_name?: string | null
  reading_time_min?: number | null
  published_at: string
  views?: number | null
  tags?: string[] | null
}

function toUiFromDb(a: DbArticle) {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    cover: a.cover ?? '/placeholder/cover.jpg',
    excerpt: a.summary ?? '',
    content: a.content ?? '',
    category: a.category ?? 'Umum',
    author: a.author_name ?? 'Redaksi',
    readingTime: (a.reading_time_min ?? 3) + ' menit',
    publishedAt: a.published_at,
    views: a.views ?? 0,
    tags: a.tags ?? [],
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // 1) Coba ambil dari Supabase
  const s = createServerClient()
  const { data: dbArticle } = await s
    .from('articles')
    .select(`
      id, slug, title, cover, content, summary,
      category, author_name, reading_time_min, published_at, views, tags
    `)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  // 2) Jika ada di DB → pakai
  const article =
    dbArticle ? toUiFromDb(dbArticle) :
    // 3) Else fallback ke template JSON
    (articlesData.articles.find((a: any) => a.slug === params.slug) ?? null)

  if (!article) return notFound()

  // Related (dari sumber yang sama)
  const related =
    dbArticle
      ? await (async () => {
          const { data } = await s
            .from('articles')
            .select('id, slug, title, cover, summary:excerpt, category, author_name:author, published_at')
            .eq('category', dbArticle.category)
            .neq('slug', params.slug)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(3)
          // normalisasi ke ArticleCard props seadanya
          return (data ?? []).map(d => ({
            id: d.id,
            slug: d.slug,
            title: d.title,
            cover: (d as any).cover ?? '/placeholder/cover.jpg',
            excerpt: (d as any).summary ?? '',
            category: (d as any).category ?? 'Umum',
            author: (d as any).author_name ?? 'Redaksi',
            publishedAt: (d as any).published_at,
          }))
        })()
      : articlesData.articles
          .filter((a: any) => a.slug !== article.slug && a.category === article.category)
          .slice(0, 3)

  const formatDate = (dateString: string) => dateID.fullLong(dateString);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/feed">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Feed
          </Link>
        </Button>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 pb-12">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image src={article.cover} alt={article.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm mb-6">
              <div className="flex items-center"><User className="h-4 w-4 mr-2" /><span>{article.author}</span></div>
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" /><span>{formatDate(article.publishedAt)}</span></div>
              <div className="flex items-center"><Clock className="h-4 w-4 mr-2" /><span>{article.readingTime}</span></div>
              <div className="flex items-center"><Eye className="h-4 w-4 mr-2" /><span>{(article as any).views ?? '—'} views</span></div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" />Share</Button>
              <Button variant="outline" size="sm"><Heart className="h-4 w-4 mr-2" />Like</Button>
            </div>
          </header>

          <Separator className="mb-8" />

          {/* Body */}
          <div className="prose prose-lg max-w-none">
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
                {article.excerpt}
              </p>
            )}

            <div className="space-y-6 text-foreground leading-relaxed">
              {/* Jika dari DB, content bisa HTML/plaintext */}
              {'content' in article ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: (article.content || '').includes('<')
                      ? (article.content as string)
                      : (article.content as string).replace(/\n/g, '<br/>'),
                  }}
                />
              ) : null}
            </div>
          </div>

          {/* Tags */}
          {'tags' in article && Array.isArray((article as any).tags) && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-semibold mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {(article as any).tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Artikel Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {related.map((a: any) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Nikmati Artikel Lainnya</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Jelajahi lebih banyak cerita menarik dari kegiatan SMA Negeri 7.
              </p>
              <Button asChild><Link href="/feed">Baca Artikel Lainnya</Link></Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
