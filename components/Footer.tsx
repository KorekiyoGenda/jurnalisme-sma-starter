import Link from 'next/link';
import { BookOpen, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">SEVEN JOURNALISM</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Suara siswa, cerita sekolah, dan inspirasi dari SMA Negeri 7 Surabaya.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/feed" className="text-muted-foreground hover:text-primary-500 transition-colors">Feed</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary-500 transition-colors">About</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary-500 transition-colors">Events</Link></li>
              <li><Link href="/clubs" className="text-muted-foreground hover:text-primary-500 transition-colors">Clubs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/guidelines" className="text-muted-foreground hover:text-primary-500 transition-colors">Panduan Menulis</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-primary-500 transition-colors">Search</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary-500 transition-colors">Kontak</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SMA Negeri 7 - Eskul Jurnalistik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}