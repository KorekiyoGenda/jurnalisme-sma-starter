'use client';

import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeading } from '@/components/SectionHeading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import articlesData from '@/data/articles.json';

const collateID = new Intl.Collator('id-ID', { sensitivity: 'base', numeric: true })

// normalisasi tanggal "YYYY-MM-DD" ke Asia/Jakarta
const toEpochJakarta = (s?: string) =>
  s ? Date.parse(`${s}T00:00:00+07:00`) : 0


export default function FeedPage() {
  const { articles, categories } = articlesData;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort articles
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return toEpochJakarta(b.publishedAt) - toEpochJakarta(a.publishedAt)
        case 'oldest':
          return toEpochJakarta(a.publishedAt) - toEpochJakarta(b.publishedAt)
        case 'title':
          return collateID.compare(a.title ?? '', b.title ?? '')
        default:
          return 0
      }
    })

    return sorted;
  }, [articles, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <SectionHeading 
            title="Feed Artikel" 
            subtitle={`Temukan ${articles.length} artikel menarik dari SMA Negeri 7`}
            className="mb-8"
          />
          
          {/* Filters */}
          <div className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4 bg-muted/50 p-4 rounded-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari artikel, tag, atau kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="title">Judul A-Z</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all' || sortBy !== 'newest') && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-destructive">
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Kategori: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-destructive">
                    ×
                  </button>
                </Badge>
              )}
              {sortBy !== 'newest' && (
                <Badge variant="secondary" className="gap-1">
                  Urutan: {sortBy === 'oldest' ? 'Terlama' : 'Judul A-Z'}
                  <button onClick={() => setSortBy('newest')} className="ml-1 hover:text-destructive">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          Menampilkan {filteredAndSortedArticles.length} dari {articles.length} artikel
        </div>

        {/* Articles Grid */}
        {filteredAndSortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah kata kunci pencarian atau filter yang digunakan.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Reset Filter
            </Button>
          </div>
        )}

        {/* Load More (placeholder) */}
        {filteredAndSortedArticles.length > 0 && filteredAndSortedArticles.length >= 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Muat Artikel Lainnya
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}