"use client";

import { useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/store';
import { 
  Plus, 
  Search, 
  Folder,
  FolderOpen,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryAction = (action: string, category: Category) => {
    switch (action) {
      case 'edit':
        toast.info(`Editing category: ${category.name}`);
        break;
      case 'delete':
        if (category.articleCount > 0) {
          toast.error('Cannot delete category with articles');
          return;
        }
        deleteCategory(category.id);
        toast.success(`Category deleted: ${category.name}`);
        break;
    }
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      label: 'Category',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: row.color }}
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">/{row.slug}</div>
          </div>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    },
    {
      key: 'articleCount',
      label: 'Articles',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm">{value}</span>
        </div>
      )
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
    { label: 'Delete', value: 'delete' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your content with categories</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Folder className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Categories</span>
          </div>
          <div className="text-2xl font-bold">{categories.length}</div>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-green-400" />
            <span className="text-sm text-muted-foreground">Total Articles</span>
          </div>
          <div className="text-2xl font-bold">
            {categories.reduce((sum, cat) => sum + cat.articleCount, 0)}
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Average per Category</span>
          </div>
          <div className="text-2xl font-bold">
            {categories.length ? Math.round(categories.reduce((sum, cat) => sum + cat.articleCount, 0) / categories.length) : 0}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-card border border-border/50 rounded-lg p-6 hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="font-semibold">{category.name}</h3>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCategoryAction('edit', category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCategoryAction('delete', category)}
                  disabled={category.articleCount > 0}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{category.articleCount} articles</span>
              </div>
              <span className="text-muted-foreground">/{category.slug}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Table */}
      {filteredCategories.length > 0 ? (
        <div className="bg-card border border-border/50 rounded-lg">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold">All Categories</h2>
          </div>
          <DataTable
            data={filteredCategories}
            columns={columns}
            onRowAction={handleCategoryAction}
            actions={actions}
          />
        </div>
      ) : searchQuery ? (
        <EmptyState
          title="No Categories Found"
          description="No categories match your search. Try adjusting your search terms."
          icon={Folder}
        />
      ) : (
        <EmptyState
          title="No Categories Yet"
          description="Start organizing your content by creating your first category."
          icon={Folder}
          actionLabel="Create Category"
          onAction={() => toast.info('Create category modal would open')}
        />
      )}
    </div>
  );
}