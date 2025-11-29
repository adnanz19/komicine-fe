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
  return (
    <nav className="px-10 z-50 sticky top-0 bg-background py-3 flex flex-row border-b justify-between">
      <Image src="/KomiCine.svg" alt="" width={100} height={100} />
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap">
          {/* All List */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} ${
                pathname === "/" ? "text-primary" : ""
              }`}
            >
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Manga */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} ${
                pathname === "/manga" ? "text-primary" : ""
              }`}
            >
              <Link href="/manga">Manga</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* Anime */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} ${
                pathname === "/anime" ? "text-primary" : ""
              }`}
            >
              <Link href="/anime">Anime</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* Movies */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} ${
                pathname === "/movies" ? "text-primary" : ""
              }`}
            >
              <Link href="/movies">Movies</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} ${
                pathname === "/favorite" ? "text-primary" : ""
              }`}
            >
              <Link href="/favorite">Favorite</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {user ? (
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({ variant: "outline" } )}
                  style={{ cursor: "pointer" }}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
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
