"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Particles } from "@/components/ui/shadcn-io/particles";

import HeroFavorites from "./pageView/HeroFavorites";
import ListFavorites from "./pageView/ListFavorites";
import PaginationFavorites from "./pageView/PaginationFavorites";

const ITEMS_PER_PAGE = 10;

const FavoritesView = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // --- STATE CONTROL ---
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Cek User Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Data
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

  // Reset Page Logic
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // 3. Remove Logic
  const handleRemoveFavorite = async (mangaId: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "favorites", mangaId);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Gagal menghapus favorit:", error);
    }
  };

  // 4. Filter Logic
  const filteredFavorites = favorites.filter((item) => {
    const matchCategory =
      activeFilter === "all"
        ? true
        : (item.type || "Manga").toLowerCase() === activeFilter;

    const matchSearch = item.title
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchCategory && matchSearch;
  });

  // 5. Pagination Logic
  const totalPages = Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFavorites = filteredFavorites.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-10 bg-background">
        <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
        <p className="text-slate-400">Silakan login terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="relative pb-20 px-6 md:px-10 overflow-hidden bg-background">
      <main className="min-h-screen relative z-10">
        
        {/* PERBAIKAN DI SINI:
            HeroFavorites ditaruh LANGSUNG di bawah main (tanpa wrapper margin/padding).
            Ini membuat jarak atasnya sama persis dengan halaman Manga.
        */}
        <HeroFavorites
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          favoritesCount={filteredFavorites.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Wrapper baru KHUSUS untuk List & Pagination 
            Agar kontennya tetap rapi di tengah (max-w-7xl) tapi tidak mendorong Hero ke bawah.
        */}
        <div className="max-w-7xl mx-auto mt-8"> 
          <ListFavorites
            loading={loading}
            favorites={currentFavorites}
            activeFilter={activeFilter}
            onRemove={handleRemoveFavorite}
          />

          {!loading && filteredFavorites.length > ITEMS_PER_PAGE && (
            <PaginationFavorites
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

      </main>

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        staticity={50}
        color="#ffffff"
        size={0.8}
      />
    </div>
  );
};

export default FavoritesView;