'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Role, Profile } from '@/types/auth'
import UserMenu from '@/components/layout/UserMenu.client' // ⬅️ pakai user menu yang sama

type Props = {
  isLoggedIn: boolean
  canAccessDashboard: boolean
  role: Role
  profile: Profile
}

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Feed', href: '/feed' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Clubs', href: '/clubs' },
]

export default function TopNavClient(props: Props) {
  const { isLoggedIn, role, profile } = props
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Satu sumber kebenaran: dashboard hanya utk non-member
  // + sembunyikan link "Dashboard" saat sudah berada di /dashboard
  const onDashboard = pathname?.startsWith('/dashboard')
  const showDashboard = !!role && role !== 'member' && !onDashboard

  const linkCls = (href: string) =>
    `transition-colors hover:text-foreground ${
      pathname === href ? 'text-foreground' : 'text-foreground/80'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">SEVEN JOURNALISM</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions (kanan) */}
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Link>
          </Button>

          {!isLoggedIn ? (
            <Button size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <UserMenu profile={profile} role={role} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto py-4 px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 text-sm font-medium ${linkCls(item.href)}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {showDashboard && (
              <Link
                href="/dashboard"
                className={`block py-2 text-sm font-medium ${linkCls('/dashboard')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            <div className="pt-2 border-t border-border space-y-2">
              <Link
                href="/search"
                className="flex items-center py-2 text-sm font-medium transition-colors hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>

              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="block py-2 text-sm font-medium transition-colors hover:text-primary-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/settings"
                    className="block py-2 text-sm font-medium transition-colors hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <form action="/auth/logout" method="post">
                    <button className="w-full text-left py-2 text-sm font-medium hover:text-primary-500">
                      Logout
                    </button>
                  </form>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
