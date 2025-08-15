import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import TopNav from '@/components/layout/TopNav'
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "SMAN 7 Journal - Eskul Jurnalistik",
  description: "Suara siswa, cerita sekolah, dan inspirasi setiap hari dari SMA Negeri 7.",
  keywords: "SMAN 7, jurnalistik, berita sekolah, artikel siswa",
  authors: [{ name: "Tim Redaksi SMAN 7" }],
  openGraph: {
    title: "Seven Journalism",
    description: "Suara siswa, cerita sekolah, dan inspirasi setiap hari.",
    type: "website",
    locale: "id_ID",
  },
}

// penting: class body harus statis & sama untuk SSR dan client
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      {/* class di body harus STABIL & sama di server/client */}
      <body
        className={`${inter.className} min-h-dvh bg-background antialiased linkwater`}
        suppressHydrationWarning
      >
        {/* pindahkan flex ke wrapper agar body-nya simpel & stabil */}
        <div className="flex min-h-dvh flex-col text-foreground">
          <TopNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
