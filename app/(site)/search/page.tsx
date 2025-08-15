'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import articlesData from '@/data/articles.json';

export default function SearchPage() {
  const { articles, categories } = articlesData;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from articles
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach(article => {
      article.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [articles]);

  // Filter articles based on search criteria
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(article.category);

      // Tags filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => article.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [articles, searchTerm, selectedCategories, selectedTags]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <SectionHeading 
          title="Pencarian Artikel"
          subtitle="Temukan artikel yang kamu cari dengan mudah"
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filter
                  </span>
                  {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Categories Filter */}
                <div>
                  <h4 className="font-medium mb-3">Kategori</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category.name, checked as boolean)
                          }
                        />
                        <label htmlFor={category.id} className="text-sm cursor-pointer">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allTags.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => 
                            handleTagChange(tag, checked as boolean)
                          }
                        />
                        <label htmlFor={tag} className="text-sm cursor-pointer">
                          #{tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Cari artikel, penulis, atau kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategories.length > 0 || selectedTags.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Pencarian: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <button 
                      onClick={() => handleCategoryChange(category, false)} 
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <button 
                      onClick={() => handleTagChange(tag, false)} 
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6 text-sm text-muted-foreground">
              {filteredArticles.length === articles.length 
                ? `Menampilkan semua ${articles.length} artikel`
                : `Ditemukan ${filteredArticles.length} dari ${articles.length} artikel`
              }
            </div>

            {/* Results Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map(article => (
                  <div key={article.id}>
                    <ArticleCard 
                      article={{
                        ...article,
                        title: typeof highlightText(article.title, searchTerm) === 'string' 
                          ? article.title 
                          : article.title, // Keep original for now, highlighting can be complex with components
                        excerpt: typeof highlightText(article.excerpt, searchTerm) === 'string'
                          ? article.excerpt
                          : article.excerpt
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Tidak ada artikel ditemukan</h3>
                <p className="text-muted-foreground mb-6">
                  Coba ubah kata kunci pencarian atau filter yang digunakan.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Reset Semua Filter
                </Button>
              </div>
            )}

          </div>
        </div>

        {/* Search Tips */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <h3 className="font-semibold mb-4">Tips Pencarian:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong>Kata Kunci Spesifik:</strong> Gunakan kata kunci yang spesifik untuk hasil yang lebih akurat
              </div>
              <div>
                <strong>Filter Kategori:</strong> Pilih kategori tertentu untuk mempersempit pencarian
              </div>
              <div>
                <strong>Kombinasi Filter:</strong> Gabungkan pencarian teks dengan filter untuk hasil optimal
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}