'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Plus, Moon, Sun, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserMenu from '@/components/layout/UserMenu.client'
import type { Viewer } from '@/types/auth'

export default function AdminTopbarClient({ viewer }: { viewer: Viewer }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDark, setIsDark] = useState(true)

  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="flex flex-1 max-w-md items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/dashboard/articles/new">
              <Plus className="h-4 w-4" />
              New Article
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/dashboard/categories">
              <Plus className="h-4 w-4" />
              Category
            </Link>
          </Button>

          <div className="mx-2 h-6 w-px bg-border/50" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Dropdown user (shared) — sembunyikan item Dashboard karena sudah di dashboard */}
          <UserMenu
            profile={viewer.profile}
            role={viewer.role}
            hideDashboardItem
          />
        </div>
      </div>
    </header>
  )
}
