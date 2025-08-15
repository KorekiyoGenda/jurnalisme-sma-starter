import Link from 'next/link';
import { ArrowRight, Calendar, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import articlesData from '@/data/articles.json';
import { dateID } from '@/lib/date';

export default function HomePage() {
  const { articles, categories, events } = articlesData;
  const featuredArticles = articles.slice(0, 3);
  const recentArticles = articles.slice(3, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-muted via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <Badge variant="outline" className="mb-4">
              Eskul Jurnalistik SMA N 7
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

      {/* Featured Articles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Berita Utama" 
            subtitle="Artikel pilihan dan update terbaru dari SMA Negeri 7"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Kategori Populer" 
            subtitle="Jelajahi berbagai topik menarik"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-all duration-300 group">
                <Link href={`/feed?category=${category.id}`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-500 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
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
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-primary-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Agenda Sekolah" 
            subtitle="Jangan lewatkan kegiatan menarik yang akan datang"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-500 text-white rounded-lg p-3 flex-shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {dateID.fullLong(event.date)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        📍 {event.location}
                      </p>
                      <p className="text-sm">
                        {event.description}
                      </p>
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

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Bergabung dengan Komunitas Jurnalistik
            </h2>
            <p className="text-lg text-muted-foreground">
              Tertarik untuk berkontribusi dalam dunia jurnalistik sekolah? 
              Bergabunglah dengan ekstrakurikuler jurnalistik SMA N7 dan kembangkan bakat menulismu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Lihat Ekstrakurikuler
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/guidelines">
                  Panduan Menulis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}