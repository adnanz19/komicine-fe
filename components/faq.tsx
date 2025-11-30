import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <div className="py-20 px-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          Paling Sering Ditanyakan
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl lg:text-xl">
          Masih bingung cara kerjanya? Temukan jawaban cepat seputar fitur,
          sumber data, dan cara penggunaan website kami di sini.
        </p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-7xl mx-auto"
      >
        {/* Pertanyaan 1: Fungsi Utama Website */}
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg hover:no-underline cursor-pointer">
            Apa fungsi utama website ini?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-base">
            <p>
              Website ini adalah platform <em>all-in-one</em> untuk melacak
              (tracking) hobi hiburanmu. Kamu bisa mencari informasi detail
              tentang Anime, Manga, Manhwa, hingga Film layar lebar.
            </p>
            <p>
              Fitur utamanya adalah membuat daftar favorit (Watchlist), menandai
              episode yang sudah ditonton, dan mendapatkan rekomendasi tontonan
              baru dalam satu tempat yang terintegrasi.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Pertanyaan 2: Akun & Biaya */}
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg hover:no-underline cursor-pointer">
            Apakah layanannya gratis?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-base">
            <p>
              Ya, 100% Gratis! Kamu bisa mengakses seluruh informasi database
              tanpa biaya sepeser pun.
            </p>
            <p>
              Namun, untuk menggunakan fitur personalisasi seperti "Simpan ke
              Favorit" atau "Tracking Progress", kamu perlu login menggunakan
              akun Google agar datamu tersimpan aman di sistem kami.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Pertanyaan 3: Sumber Data (Teknis/Kredibilitas) */}
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg hover:no-underline cursor-pointer">
            Dari mana sumber datanya diambil?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-base">
            <p>
              Kami menggunakan API publik terpercaya untuk memastikan data
              selalu akurat dan <em>up-to-date</em>.
            </p>
            <p>
              Data Anime dan Manga diambil dari{" "}
              <strong>Jikan API (MyAnimeList)</strong>, sedangkan data Film dan
              TV Series diambil dari <strong>TMDB (The Movie Database)</strong>.
              Jadi, rating dan sinopsis yang kamu lihat adalah standar global.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Pertanyaan 4: Klarifikasi Nonton/Baca (PENTING biar gak dikira web ilegal) */}
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg hover:no-underline cursor-pointer">
            Bisakah saya menonton atau membaca komik langsung di sini?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-base">
            <p>
              Saat ini, fokus utama kami adalah sebagai{" "}
              <strong>Tracker & Database</strong>. Kami membantu kamu mencatat
              riwayat tontonan agar lebih rapi.
            </p>
            <p>
              Kami tidak menyimpan file video atau komik (hosting) karena alasan
              hak cipta. Namun, kami menyediakan informasi link ke platform
              streaming legal (seperti Netflix, Crunchyroll, dll) jika tersedia
              dari penyedia data.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Pertanyaan 5: Mobile Support (Menonjolkan UI Responsif kamu) */}
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-lg hover:no-underline cursor-pointer">
            Apakah bisa diakses lewat HP?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-base">
            <p>
              Tentu saja! Website ini didesain agar responsif dan ringan di
              semua perangkat, baik itu Laptop, Tablet, maupun Smartphone.
            </p>
            <p>
              Tampilannya akan otomatis menyesuaikan layar HP-mu agar pengalaman{" "}
              <em>scrolling</em> dan mencari daftar anime tetap nyaman di mana
              saja.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
