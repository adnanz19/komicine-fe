"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star,
  LayoutGrid,   // Icon All
  Book,         // Icon Manga
  MonitorPlay,  // Icon Anime
  Clapperboard  // Icon Movie
} from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  // State untuk Filter (Default: 'all')
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // 1. Cek User Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Ambil Data Realtime
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "favorites"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Fungsi Hapus Favorit
  const handleRemoveFavorite = async (mangaId: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "favorites", mangaId);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Gagal menghapus favorit:", error);
    }
  };

  // 4. Logika Filter Data
  const filteredFavorites = favorites.filter((item) => {
    if (activeFilter === "all") return true;
    
    // Asumsi: Nanti kamu menyimpan field 'type' ("Manga", "Anime", "Movie") di Firebase
    // Kalau data lama belum ada 'type', kita anggap Manga dulu (opsional)
    const itemType = item.type || "Manga"; 
    
    return itemType.toLowerCase() === activeFilter;
  });

  // Helper Status Icon
  const getStatusIcon = (status: string) => {
    if (!status) return <Clock className="w-4 h-4 text-slate-500" />;
    switch (status.toLowerCase()) {
      case "finished":
      case "completed": // Anime biasanya pakai 'completed'
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "publishing":
      case "airing": // Anime pakai 'airing'
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  // --- Opsi Kategori Filter ---
  const filterCategories = [
    { id: "all", name: "Semua", icon: <LayoutGrid className="w-3 h-3" /> },
    { id: "manga", name: "Manga", icon: <Book className="w-3 h-3" /> },
    { id: "anime", name: "Anime", icon: <MonitorPlay className="w-3 h-3" /> },
    { id: "movie", name: "Movie", icon: <Clapperboard className="w-3 h-3" /> },
  ];

  // --- RENDER ---

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-10">
        <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
        <p className="text-slate-400">Silakan login terlebih dahulu untuk melihat favorit.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 my-10 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
           My Favorites
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Koleksi ({favorites.length}) item yang telah Anda simpan
        </p>

        {/* --- FILTER BUTTONS (Layout sama seperti HeroMangas) --- */}
        <div className="flex flex-wrap justify-center items-center gap-3">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all duration-300 text-xs md:text-sm backdrop-blur-sm ${
                  activeFilter === cat.id
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-purple-600 hover:border-purple-500"
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array(10).fill(0).map((_, index) => (
            <Card key={index} className="rounded-xl border border-slate-800 bg-slate-900 shadow-sm p-4 h-64">
               <div className="animate-pulse bg-slate-800 h-full w-full rounded"></div>
            </Card>
          ))}
        </div>
      ) : filteredFavorites.length === 0 ? (
         <div className="text-center py-20 bg-transparent rounded-xl border border-dashed border-slate-800">
             <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
             <p className="text-gray-400 text-lg">
                Tidak ada {activeFilter === 'all' ? 'item' : activeFilter} di favorit.
             </p>
             <Link
              href={
                activeFilter === "manga" ? "/mangas" :
                activeFilter === "anime" ? "/animes" :
                activeFilter === "movie" ? "/movies" : "mangas"
              }
              className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">
                Cari {activeFilter === 'all' ? 'Manga, Anime, atau Film' : activeFilter} Baru
             </Link>
         </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in zoom-in duration-500">
          {filteredFavorites.map((item) => (
            <Card
              key={item.id}
              className="group relative flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-md hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 hover:border-slate-600 transition-all duration-300 overflow-hidden p-0"
            >
              <div className="relative w-full aspect-2/3 overflow-hidden bg-slate-800">
                {/* Link dinamis: cek tipe item untuk menentukan arah link */}
                <Link href={`/${item.type ? item.type.toLowerCase() + 's' : 'mangas'}/detail/${item.mal_id}`}>
                  <Image
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-90 cursor-pointer"
                    loading="lazy"
                  />
                </Link>

                {/* Badge Tipe Media (Manga/Anime) di pojok kiri atas */}
                {item.type && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                        {item.type}
                    </div>
                )}

                <button
                  onClick={() => handleRemoveFavorite(item.id)}
                  title="Hapus dari favorit"
                  className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none bg-black/40 hover:bg-black/60 backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
              </div>

              <div className="flex flex-col grow p-4 space-y-3">
                <Link href={`/${item.type ? item.type.toLowerCase() + 's' : 'mangas'}/detail/${item.mal_id}`}>
                  <h3
                    className="font-bold text-base md:text-lg line-clamp-2 leading-tight text-slate-100 group-hover:text-blue-400 transition-colors"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                </Link>

                <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-slate-800/50">
                  <div className="flex justify-between items-center text-sm text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="text-xs md:text-sm">
                        {/* Tampilkan Chapters (Manga) atau Episodes (Anime) */}
                        {item.chapters 
                            ? `${item.chapters} Ch.` 
                            : item.episodes 
                                ? `${item.episodes} Eps.` 
                                : "?"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(item.status)}
                      <span
                        className={`text-xs md:text-sm capitalize ${
                          item.status?.toLowerCase().includes("finished") || item.status?.toLowerCase().includes("completed")
                            ? "text-emerald-400"
                            : "text-blue-400"
                        }`}
                      >
                         {/* Singkatkan status panjang */}
                        {item.status === "Publishing" ? "Ongoing" : item.status === "Finished" ? "End" : item.status || "?"}
                      </span>
                    </div>
                  </div>

                  {item.score > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 w-fit px-2 py-1 rounded-md self-start border border-slate-700">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{Number(item.score).toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}