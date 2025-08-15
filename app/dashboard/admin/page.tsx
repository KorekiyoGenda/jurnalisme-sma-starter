"use client";

import { useAdminStore } from '@/lib/store';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Article } from '@/lib/store';
import { 
  FileText, 
  Edit3, 
  Eye, 
  CheckCircle, 
  Clock,
  MessageSquare 
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { fmt } from "@/lib/number"

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

export default function AdminDashboard() {
  const { articles, users } = useAdminStore();
  
  const stats = {
    published: articles.filter(a => a.status === 'Published').length,
    draft: articles.filter(a => a.status === 'Draft').length,
    inReview: articles.filter(a => a.status === 'In Review').length,
    scheduled: articles.filter(a => a.status === 'Scheduled').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    totalComments: articles.reduce((sum, a) => sum + a.comments, 0),
  };

  const recentArticles = articles
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const columns: Column<Article>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.excerpt}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'author',
      label: 'Author',
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'views',
      label: 'Views',
      render: (value) => (<span className="text-sm tabular-nums"> {new Intl.NumberFormat("id-ID").format(Number(value ?? 0))} </span>)
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value) => format(new Date(value), 'dd MMM yyyy', { locale: localeId })
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di panel admin SMAN 7 Journalism</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Published Articles"
          value={stats.published}
          icon={CheckCircle}
          color="success"
          change={{ value: "+12%", isPositive: true }}
        />
        <StatsCard
          title="Draft Articles"
          value={stats.draft}
          icon={Edit3}
          color="warning"
        />
        <StatsCard
          title="In Review"
          value={stats.inReview}
          icon={Clock}
          color="primary"
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          color="default"
          change={{ value: "+8%", isPositive: true }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Scheduled Posts"
          value={stats.scheduled}
          icon={Clock}
          color="primary"
        />
        <StatsCard
          title="Comments"
          value={stats.totalComments}
          icon={MessageSquare}
          color="default"
          change={{ value: "+15%", isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border/50 rounded-lg">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-semibold">Recent Articles</h2>
          <p className="text-sm text-muted-foreground">Latest activity on your content</p>
        </div>
        <div className="p-6">
          <DataTable
            data={recentArticles}
            columns={columns}
            emptyMessage="No recent articles"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border/50 rounded-lg hover:bg-accent/30 cursor-pointer transition-colors">
            <FileText className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-medium">Create Article</h4>
            <p className="text-sm text-muted-foreground">Start writing a new article</p>
          </div>
          <div className="p-4 border border-border/50 rounded-lg hover:bg-accent/30 cursor-pointer transition-colors">
            <Eye className="w-6 h-6 text-green-400 mb-2" />
            <h4 className="font-medium">Review Articles</h4>
            <p className="text-sm text-muted-foreground">Check articles awaiting review</p>
          </div>
          <div className="p-4 border border-border/50 rounded-lg hover:bg-accent/30 cursor-pointer transition-colors">
            <MessageSquare className="w-6 h-6 text-blue-400 mb-2" />
            <h4 className="font-medium">Manage Comments</h4>
            <p className="text-sm text-muted-foreground">Moderate user comments</p>
          </div>
        </div>
      </div>
    </div>
  );
}