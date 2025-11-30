import FavoritesView from '@/components/favoriteView/FavoritesView'
import React from 'react'

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Favorit",
};

const FavoritesPage = () => {
  return (
    <div>
      <FavoritesView />
    </div>
  )
}

export default FavoritesPage