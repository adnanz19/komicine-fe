"use client";
import React, { useState } from "react";
import HeroMangas from "./HeroMangas";
import ListMangas from "./ListMangas";

const MangaViews = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (keyword:string) => {
        setSearchQuery(keyword);
    };
  return (
    <div>
      <HeroMangas onSearch={handleSearch} />
      <ListMangas searchQuery={searchQuery} />
    </div>
  );
};

export default MangaViews;
