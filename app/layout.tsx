import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import NavbarWrapper from "@/components/shared/navbar-wrapper";
import { Navbar } from "@/components/shared/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Konfigurasi Judul Dinamis
  title: {
    default: "KomiCine - Anime, Manga & Movie Terlengkap", 
    template: "%s | KomiCine",
  },
  description: "Platform terlengkap untuk baca manga, cari anime, dan koleksi film favoritmu. Update setiap hari dengan database terlengkap.",
  icons: {
    icon: "/KomiCine.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <NavbarWrapper/>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
