"use client";

import { useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Media } from '@/lib/store';
import { 
  Plus, 
  Search, 
  Image as ImageIcon,
  Trash2,
  Download,
  Eye,
  FileText
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function MediaPage() {
  const { media, deleteMedia } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleMediaAction = (action: string, mediaItem: Media) => {
    switch (action) {
      case 'preview':
        toast.info(`Previewing: ${mediaItem.filename}`);
        break;
      case 'download':
        toast.info(`Downloading: ${mediaItem.filename}`);
        break;
      case 'delete':
        deleteMedia(mediaItem.id);
        toast.success(`Media deleted: ${mediaItem.filename}`);
        break;
    }
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteMedia(id));
    toast.success(`${selectedIds.length} media files deleted`);
    setSelectedIds([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const totalSize = media.reduce((sum, item) => sum + item.size, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your images and files</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Media
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Files</span>
          </div>
          <div className="text-2xl font-bold">{media.length}</div>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-green-400" />
            <span className="text-sm text-muted-foreground">Images</span>
          </div>
          <div className="text-2xl font-bold">
            {media.filter(m => m.type === 'image').length}
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">Total Size</span>
          </div>
          <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">In Use</span>
          </div>
          <div className="text-2xl font-bold">
            {media.filter(m => m.usedIn.length > 0).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.length} files selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDelete}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              className={`bg-card border rounded-lg overflow-hidden hover:border-primary/20 transition-colors ${
                selectedIds.includes(item.id) ? 'border-primary ring-1 ring-primary/20' : 'border-border/50'
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-square relative bg-muted/30">
                <img
                  src={item.thumbnail}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    className="w-4 h-4 rounded border-2 border-white/50 bg-black/20 checked:bg-primary"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <div className="text-sm font-medium truncate">{item.original_name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.dimensions ? `${item.dimensions.width}×${item.dimensions.height}` : 'N/A'} • {formatFileSize(item.size)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(item.uploadedAt), 'dd MMM yyyy', { locale: localeId })}
                </div>
                
                {/* Usage indicator */}
                {item.usedIn.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <FileText className="w-3 h-3" />
                    Used in {item.usedIn.length} article{item.usedIn.length !== 1 ? 's' : ''}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-1 pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={() => handleMediaAction('preview', item)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={() => handleMediaAction('download', item)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-red-400 hover:text-red-300"
                    onClick={() => handleMediaAction('delete', item)}
                    disabled={item.usedIn.length > 0}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Media Files"
          description="Upload your first image or file to get started with your media library."
          icon={ImageIcon}
          actionLabel="Upload Media"
          onAction={() => toast.info('Upload media modal would open')}
        />
      )}
    </div>
  );
}