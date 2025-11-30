"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { Menu } from "lucide-react";
import { Separator } from "../ui/separator";

export const Navbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    alert("You have been logged out.");
    await signOut(auth);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mangas", label: "Manga" },
    { href: "/animes", label: "Anime" },
    { href: "/movies", label: "Movies" },
    { href: "/favorites", label: "Favorite" },
  ];

  return (
    <nav className="px-4 md:px-10 z-50 sticky top-0 bg-background py-3 flex flex-row border-b justify-between items-center">
      <Link href="/">
        <Image src="/KomiCine.svg" alt="KomiCine Logo" width={100} height={100} />
      </Link>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList className="flex-wrap">
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} ${
                  pathname === link.href ? "text-primary" : ""
                }`}
              >
                <Link href={link.href}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "outline", size: "icon" })}
              style={{ cursor: "pointer" }}
            >
              <UserIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.displayName || user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer focus:bg-primary/50 hover:bg-primary/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "outline", size: "icon" })}
                style={{ cursor: "pointer" }}
              >
                <Menu className="h-6 w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={`${
                        pathname === link.href ? "text-primary" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Desktop Auth Buttons/Dropdown */}
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList className="gap-2 items-center">
          {user ? (
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({ variant: "outline" } )}
                  style={{ cursor: "pointer" }}
                >
                  <UserIcon className="mr-2 h-4 w-4" /> {/* Icon for desktop */}
                  {user.displayName || user.email}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-primary/50 hover:bg-primary/50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          ) : (
            <>
              <NavigationMenuItem>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
