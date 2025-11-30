# 🎬 Komicine - Your Ultimate Entertainment Platform


![Komicine Logo](public/KomiCine.svg)

**Platform Daftar List dan Info manga, anime, serta movie terlengkap di Indonesia**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-9-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)



## 📖 Tentang Komicine

Komicine adalah platform entertainment modern yang menggabungkan manga, anime, dan movie dalam satu tempat. Dengan antarmuka yang responsif dan fitur-fitur canggih, pengguna dapat menjelajahi ribuan konten dari berbagai genre dan negara.

### ✨ Fitur Utama

- 📚 **Manga Database**: Koleksi lengkap manga dari MyAnimeList API
- 🎌 **Anime Collection**: Database anime terbaru dengan informasi detail
- 🎬 **Movie Library**: Integrasi dengan TMDB API untuk movie terlengkap
- ❤️ **Sistem Favorit**: Simpan konten favorit dengan sinkronisasi real-time
- 🔒 **Safe Mode**: Filter konten dewasa untuk pengalaman yang aman
- 🔍 **Advanced Search**: Pencarian dengan filter genre dan kata kunci
- 📱 **Responsive Design**: Optimal di semua perangkat
- 🌓 **Dark/Light Theme**: Dukungan tema gelap dan terang
- 🔐 **Authentication**: Sistem login/register dengan Firebase Auth

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Authentication**: Firebase Auth
- **Database**: Firestore

### APIs

- **Manga & Anime**: Jikan API (MyAnimeList)
- **Movies**: The Movie Database (TMDB) API
- **Images**: Optimized dengan Next.js Image

### Tools & Libraries

- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Animations**: Tailwind CSS transitions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, atau bun
- Firebase project
- TMDB API key

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/adnanz19/komicine-fe.git
   cd komicine-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` dan tambahkan:

   ```env
   # Jikan API (MyAnimeList)
   NEXT_PUBLIC_JIKAN_API_URL=Hubungi_Owner

   # TMDB API
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_API_URL=Hubungi_Owner
   NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=Hubungi_Owner

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=Hubungi_Owner
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open browser**

   Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Project Structure

```
komicine-fe/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   ├── animes/              # Anime pages
│   ├── mangas/              # Manga pages
│   ├── movies/              # Movie pages
│   ├── favorites/           # Favorites page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── animeView/           # Anime-specific components
│   ├── mangasView/          # Manga-specific components
│   ├── movieView/           # Movie-specific components
│   ├── shared/              # Shared components
│   └── ui/                  # UI components (shadcn/ui)
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 🎯 Features Overview

### 🔍 Search & Filter

- Search manga, anime, dan movie berdasarkan judul
- Filter berdasarkan genre
- Pagination dengan navigasi yang smooth
- Safe mode untuk menyembunyikan konten dewasa

### ❤️ Favorites System

- Tambah/hapus favorit dengan satu klik
- Sinkronisasi real-time dengan Firebase
- Cross-device synchronization
- Organize favorites by type (manga/anime/movie)

### 🎨 UI/UX

- Modern glassmorphism design
- Smooth animations dan transitions
- Responsive grid layout
- Optimized loading states
- Error handling yang user-friendly

### 🔐 Authentication

- Register dengan email/password
- Login dengan validasi
- Protected routes
- User profile management

## 🌐 API Integration
```

1. Jikan API (MyAnimeList)
2. TMDB API
 ```

## 🚀 Deployment

### Vercel
```
1. Push code ke GitHub repository
2. Import project di [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!
```
### Manual Build

```bash
npm install
npm run start
```

## 👥 Team

- [@Pandu Nugraha Saputra](https://github.com/Panduukece123)
- [@Bima Adnandita](https://github.com/adnanz19)

## 🤝 Contributing
```
Kami menerima kontribusi! Silakan buat issue atau pull request.

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request
```
## 📝 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) untuk data manga dan anime
- [TMDB](https://www.themoviedb.org/) untuk data movie
- [shadcn/ui](https://ui.shadcn.com/) untuk komponen UI
- [Vercel](https://vercel.com/) untuk hosting platform

---
```
  Made by Pandu & Bima
  © 2024 Komicine. All rights reserved.
```
