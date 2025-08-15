# Journalisme SMA — Next.js + Supabase Starter

Starter minimal untuk portal Journalisme SMA dengan:
- Next.js (App Router)
- Tailwind CSS
- Supabase (Auth Google + DB)
- Basic workflow artikel: draft → in_review → published (server actions contoh)
- Halaman: Home (artikel terbit), Article Detail, About (Team), Dashboard (draft & review)

## 1) Setup
```bash
# 1. Install dependencies
npm install

# 2. Salin .env.example menjadi .env.local lalu isi
cp .env.example .env.local

# 3. Jalankan dev server
npm run dev
```
Buka http://localhost:3000

## 2) Environment Variables
Isi dari Supabase Project Settings → API dan Authentication (Google OAuth sudah diaktifkan di dashboard kamu).
```
NEXT_PUBLIC_SUPABASE_URL=...        # https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # anon key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3) Supabase Schema
Jalankan SQL skema & RLS yang ada di blueprint (canvas). Pastikan tabel:
- profiles, cohorts, team_members, categories, articles, tags, review_logs
- Enums: role_type, member_status, article_status

## 4) Google Login
Di Supabase → Auth → Providers → Google: masukkan Client ID & Secret dari Google Cloud.
Di Google Cloud OAuth client:
- Authorized JS origins: http://localhost:3000 (development)
- Authorized redirect URIs: (Callback URL dari Supabase)

## 5) Build & Deploy
- Push ke GitHub → import di Vercel → set env vars di Vercel → Deploy.
- Tambahkan domain sekolah di Vercel jika perlu.

## Catatan
Starter ini sengaja minimal agar mudah dikembangkan. Komponen UI bisa ditingkatkan pakai shadcn/ui.
```bash
# contoh menambahkan shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input textarea badge dialog tabs accordion switch separator
```