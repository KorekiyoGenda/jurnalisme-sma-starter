'use client'

import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { LogOut, Settings, User, LayoutDashboard, AtSign } from 'lucide-react'

type Role = 'admin' | 'editor' | 'writer' | 'member' | null
type Profile = {
  name: string | null
  username: string | null
  email: string | null
  avatarUrl: string | null
}

const ROLE_LABEL: Record<Exclude<Role, null>, string> = {
  admin: 'Admin',
  editor: 'Editor',
  writer: 'Penulis',
  member: 'Member',
}

const ROLE_CLASS: Record<Exclude<Role, null>, string> = {
  admin:  'bg-red-600/10 text-red-600 border-red-600/20',
  editor: 'bg-blue-600/10 text-blue-600 border-blue-600/20',
  writer: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20',
  member: 'bg-zinc-600/10 text-zinc-700 dark:text-zinc-300 border-zinc-600/20',
}

export default function UserMenu({
  profile,
  role,
  hideDashboardItem = false,
}: {
  profile: Profile
  role: Role
  hideDashboardItem?: boolean
}) {
  const displayName = profile?.name ?? profile?.username ?? profile?.email ?? 'Pengguna'
  const initials =
    (profile?.name?.match(/\b\w/g)?.join('') ??
     profile?.username?.slice(0, 2) ??
     profile?.email?.slice(0, 2) ??
     'US')
      .toUpperCase()

  const rr = (role ?? 'member') as Exclude<Role, null>
  const showDashboard = rr !== 'member' && !hideDashboardItem

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none" aria-label="Buka menu user">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatarUrl ?? undefined} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        {/* Header */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold leading-tight">
              {displayName}
            </div>
            <Badge variant="outline" className={`h-6 px-2 ${ROLE_CLASS[rr]}`}>
              {ROLE_LABEL[rr]}
            </Badge>
          </div>

          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <AtSign className="h-3.5 w-3.5" />
            <span>{profile?.username ?? 'user'}</span>
          </div>

          {profile?.email && (
            <div className="text-xs text-muted-foreground">{profile.email}</div>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings/profile"><Settings className="mr-2 h-4 w-4" /> Ubah nama & username</Link>
        </DropdownMenuItem>

        {showDashboard && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <form action="/auth/logout" method="POST" className="w-full">
            <button type="submit" className="flex w-full items-center">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
