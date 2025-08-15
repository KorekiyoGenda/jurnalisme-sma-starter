"use client";

import { useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Article } from '@/lib/store';
import { 
  Plus, 
  Search, 
  Filter,
  FileText,
  Trash2,
  Edit,
  Eye,
  Archive
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';

function StatusBadge({ status }: { status: string }) {
  const badgeClass = {
    'Published': 'badge-published',
    'Draft': 'badge-draft',
    'In Review': 'badge-review',
    'Scheduled': 'badge-scheduled',
    'Archived': 'badge-archived',
  }[status] || 'badge-draft';

  return <span className={`badge ${badgeClass}`}>{status}</span>;
}

export default function ArticlesPage() {
  const { articles, categories, bulkUpdateArticles, deleteArticle } = useAdminStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) return;

    switch (action) {
      case 'publish':
        bulkUpdateArticles(selectedIds, { status: 'Published' });
        toast.success(`${selectedIds.length} articles published`);
        break;
      case 'archive':
        bulkUpdateArticles(selectedIds, { status: 'Archived' });
        toast.success(`${selectedIds.length} articles archived`);
        break;
      case 'delete':
        selectedIds.forEach(id => deleteArticle(id));
        toast.success(`${selectedIds.length} articles deleted`);
        break;
    }
    setSelectedIds([]);
  };

  const handleRowAction = (action: string, article: Article) => {
    switch (action) {
      case 'edit':
        toast.info(`Editing: ${article.title}`);
        break;
      case 'preview':
        toast.info(`Previewing: ${article.title}`);
        break;
      case 'publish':
        bulkUpdateArticles([article.id], { status: 'Published' });
        toast.success(`Article published: ${article.title}`);
        break;
      case 'archive':
        bulkUpdateArticles([article.id], { status: 'Archived' });
        toast.success(`Article archived: ${article.title}`);
        break;
      case 'delete':
        deleteArticle(article.id);
        toast.success(`Article deleted: ${article.title}`);
        break;
    }
  };

  const columns: Column<Article>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{row.excerpt}</div>
          <div className="flex gap-1 mt-2">
            {row.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-muted text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-accent/30 text-xs rounded-md">{value}</span>
      )
    },
    {
      key: 'author',
      label: 'Author',
      sortable: true,
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (value) => <span className="text-sm font-mono">{value.toLocaleString()}</span>
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (value) => (
        <span className="text-sm">
          {format(new Date(value), 'dd MMM yyyy', { locale: localeId })}
        </span>
      )
    }
  ];

  const actions = [
    { label: 'Edit', value: 'edit' },
    { label: 'Preview', value: 'preview' },
    { label: 'Publish', value: 'publish' },
    { label: 'Archive', value: 'archive' },
    { label: 'Delete', value: 'delete' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">Manage your journalism content</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.length} articles selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('publish')}
            >
              Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('archive')}
            >
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('delete')}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Articles Table */}
      {filteredArticles.length > 0 ? (
        <div className="bg-card border border-border/50 rounded-lg">
          <DataTable
            data={filteredArticles}
            columns={columns}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowAction={handleRowAction}
            actions={actions}
          />
        </div>
      ) : (
        <EmptyState
          title="No Articles Found"
          description="Get started by creating your first article or adjust your search filters."
          icon={FileText}
          actionLabel="Create Article"
          onAction={() => toast.info('Create article modal would open')}
        />
      )}
    </div>
  );
}