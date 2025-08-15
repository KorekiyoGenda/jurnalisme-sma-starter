"use client";

import { useAdminStore } from '@/lib/store';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Article } from '@/lib/store';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Clock,
  BarChart3,
  MousePointer
} from 'lucide-react';

interface AnalyticsData {
  title: string;
  views_7d: number;
  avg_time: string;
  ctr: number;
}

export default function AnalyticsPage() {
  const { articles } = useAdminStore();
  
  // Calculate analytics
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const publishedArticles = articles.filter(a => a.status === 'Published');
  const avgViews = publishedArticles.length > 0 ? Math.round(totalViews / publishedArticles.length) : 0;
  
  // Mock data for top articles
  const topArticles: AnalyticsData[] = publishedArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map(article => ({
      title: article.title,
      views_7d: Math.floor(article.views * 0.3), // Mock 7-day views as 30% of total
      avg_time: `${Math.floor(Math.random() * 3 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      ctr: Number((Math.random() * 5 + 2).toFixed(1))
    }));

  const columns: Column<AnalyticsData>[] = [
    {
      key: 'title',
      label: 'Article Title',
      sortable: true,
      render: (value) => (
        <div className="font-medium max-w-md truncate">{value}</div>
      )
    },
    {
      key: 'views_7d',
      label: 'Views (7d)',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'avg_time',
      label: 'Avg. Time',
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'ctr',
      label: 'CTR (%)',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value}%</span>
      )
    }
  ];

  // Mock weekly data for mini chart
  const weeklyData = [
    { day: 'Mon', views: 1200 },
    { day: 'Tue', views: 1400 },
    { day: 'Wed', views: 1100 },
    { day: 'Thu', views: 1600 },
    { day: 'Fri', views: 1800 },
    { day: 'Sat', views: 800 },
    { day: 'Sun', views: 900 },
  ];

  const maxViews = Math.max(...weeklyData.map(d => d.views));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your journalism platform performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Views Today"
          value="2,543"
          icon={Eye}
          color="primary"
          change={{ value: "+12%", isPositive: true }}
        />
        <StatsCard
          title="7d Average"
          value={avgViews.toLocaleString()}
          icon={TrendingUp}
          color="success"
          change={{ value: "+8%", isPositive: true }}
        />
        <StatsCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          icon={BarChart3}
          color="default"
        />
        <StatsCard
          title="Avg. CTR"
          value="3.2%"
          icon={MousePointer}
          color="warning"
          change={{ value: "-2%", isPositive: false }}
        />
      </div>

      {/* Weekly Chart */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Weekly Views</h2>
            <p className="text-sm text-muted-foreground">Daily page views for the past 7 days</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">9,800</div>
            <div className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15% from last week
            </div>
          </div>
        </div>
        
        {/* Mini Chart */}
        <div className="flex items-end gap-3 h-32">
          {weeklyData.map((data, index) => (
            <div key={data.day} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-primary/20 rounded-t-sm mb-2 transition-all duration-500"
                style={{ 
                  height: `${(data.views / maxViews) * 80}px`,
                  backgroundColor: index === weeklyData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.6)'
                }}
              />
              <div className="text-xs text-muted-foreground">{data.day}</div>
              <div className="text-xs font-mono">{data.views.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-card border border-border/50 rounded-lg">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-semibold">Top Performing Articles</h2>
          <p className="text-sm text-muted-foreground">Most viewed articles with performance metrics</p>
        </div>
        <div className="p-6">
          <DataTable
            data={topArticles}
            columns={columns}
            emptyMessage="No performance data available"
          />
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Audience</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">New Visitors</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Returning Visitors</span>
              <span className="text-sm font-medium">32%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Session Duration</span>
              <span className="text-sm font-medium">2:34</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Top Categories</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Kegiatan</span>
              <span className="text-sm font-medium">2,145 views</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Feature</span>
              <span className="text-sm font-medium">1,832 views</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Edu</span>
              <span className="text-sm font-medium">1,456 views</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Publishing</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">This Week</span>
              <span className="text-sm font-medium">3 articles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">This Month</span>
              <span className="text-sm font-medium">12 articles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. per Week</span>
              <span className="text-sm font-medium">2.5 articles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}