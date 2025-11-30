import MangaViews from '@/components/mangasView/MangaViews'
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Manga",
};

const MangasPage = () => {
  return (
    <>
    <MangaViews />
    
    
    </>
  )
}

export default MangasPage