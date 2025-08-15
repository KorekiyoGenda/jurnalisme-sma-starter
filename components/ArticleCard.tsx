import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover: string;
    author: string;
    category: string;
    tags: string[];
    publishedAt: string;
    readingTime: string;
  };
  variant?: 'default' | 'featured' | 'compact';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <Link href={`/article/${article.slug}`}>
          <div className="relative h-64 md:h-80">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge variant="secondary" className="mb-2">
                {article.category}
              </Badge>
              <h2 className="text-white font-bold text-xl md:text-2xl mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-white/90 text-sm line-clamp-2 mb-2">
                {article.excerpt}
              </p>
              <div className="flex items-center text-white/80 text-xs space-x-4">
                <span className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {article.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {article.readingTime}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 group">
        <Link href={`/article/${article.slug}`}>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={article.cover}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="text-xs mb-1">
                  {article.category}
                </Badge>
                <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary-500 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center text-muted-foreground text-xs space-x-3">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readingTime}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link href={`/article/${article.slug}`}>
        <div className="relative h-48">
          <Image
            src={article.cover}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-6">
          <Badge variant="outline" className="mb-3">
            {article.category}
          </Badge>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {article.author}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {article.readingTime}
              </span>
            </div>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}