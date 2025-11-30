import AnimeViews from '@/components/animeView/AnimeView'
import React from 'react'

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Anime",
};

const AnimePage = () => {
  return (
    <div>
      <AnimeViews />
    </div>
  )
}

export default AnimePage