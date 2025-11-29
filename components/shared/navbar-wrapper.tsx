"use client"; // <--- Wajib, karena pakai usePathname

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar"; // Import Navbar aslimu

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Daftar halaman yang TIDAK boleh ada Navbar
  const disableNavbar = ["/login", "/register"];

  // Jika URL saat ini ada di daftar disable, jangan render apa-apa (null)
  if (disableNavbar.includes(pathname)) {
    return null;
  }

  // Selain itu, munculkan Navbar
  return <Navbar />;
}