import Image from "next/image";
import React from "react";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const FooterSection = ({
  logo = {
    src: "/KomiCine.svg", // Pastikan punya logo atau ganti jadi string kosong
    alt: "Logo Website",
    title: "ScreenScroll", // Atau nama brand pilihanmu
    url: "/",
  },
  tagline = "Platform terlengkap untuk melacak Anime, Manga, dan Film favoritmu.",
  menuItems = [
    {
      title: "Jelajahi",
      links: [
        { text: "Anime Musim Ini", url: "/anime" },
        { text: "Manga Populer", url: "/manga" },
        { text: "Film Box Office", url: "/movie" },
        { text: "Pencarian Lanjut", url: "/search" },
      ],
    },
    {
      title: "Akun",
      links: [
        { text: "Masuk / Daftar", url: "/login" },
        { text: "Koleksi Saya", url: "/profile/library" },
        { text: "Pengaturan", url: "/settings" },
        { text: "Lupa Password", url: "/reset-password" },
      ],
    },
    {
      title: "Info & Bantuan",
      links: [
        { text: "Tentang Kami", url: "/about" },
        { text: "FAQ / Pertanyaan", url: "/faq" },
        { text: "Status API", url: "/status" },
        { text: "Kontak Developer", url: "/contact" },
      ],
    },
    {
      title: "Sosial Media",
      links: [
        { text: "GitHub", url: "https://github.com/bimaadnandita" }, // Ganti user githubmu
        { text: "Instagram", url: "#" },
        { text: "Discord Community", url: "#" },
      ],
    },
  ],
  copyright = "© 2025 ScreenScroll. Dibuat dengan ❤️ oleh Bima Adnandita dan Pandu Nugraha Saputra.",
  bottomLinks = [
    { text: "Syarat & Ketentuan", url: "/terms" },
    { text: "Kebijakan Privasi", url: "/privacy" },
  ],
}: FooterProps) => {
  return (
    <section className="pt-20 pb-10 px-10 bg-background border-t"> {/* Tambah border-t biar rapi */}
      <div className="w-full max-w-7xl mx-auto">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <a href={logo.url} className="flex items-center gap-2">
                  <Image width={150} height={40} src={logo.src} alt={logo.alt} title={logo.title} />
                </a>
              </div>
              <p className="mt-4 text-muted-foreground font-medium pr-4">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-foreground">{section.title}</h3>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary transition-colors font-medium"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="hover:text-primary transition-colors underline decoration-dotted">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { FooterSection };