"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Folder, 
  Image, 
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Articles', href: '/dashboard/articles', icon: Newspaper },
  { label: 'Users', href: '/dashboard/users', icon: Users },
  { label: 'Categories', href: '/dashboard/categories', icon: Folder },
  { label: 'Media', href: '/dashboard/media', icon: Image },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useAdminStore();

  return (
    <div className={cn(
      "admin-sidebar fixed left-0 top-0 z-40",
      sidebarCollapsed ? "collapsed" : ""
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="text-sm font-semibold">SENOUR</div>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 hover:bg-accent/50 rounded-lg transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-item",
                isActive && "active"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Admin Dashboard v1.0
          </div>
        </div>
      )}
    </div>
  );
}