// next.config.mjs

/** @type {import('next').NextConfig} */

// Ambil host dari URL Supabase, contoh:
// NEXT_PUBLIC_SUPABASE_URL="https://ufrgiwfgxwfcxflhztq.supabase.co"
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : undefined;

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Supabase Storage (avatar, dsb)
      ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),

      // Sumber gambar lain yang kamu pakai
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },

  // NOTE:
  // Jika kamu masih di Next 14 dan BUTUH menaikkan batas 1MB Server Actions,
  // boleh aktifkan blok di bawah (hapus komentar). Di Next 15 ini akan error.
  //
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: '10mb',
  //     allowedOrigins: ['http://localhost:3000'], // sesuaikan saat production
  //   },
  // },
};

export default nextConfig;
