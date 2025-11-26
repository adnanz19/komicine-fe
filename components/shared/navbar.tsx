"use client";

import * as React from "react";
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
import { Button } from "../ui/button";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className="px-10 sticky top-0 bg-background py-3 flex flex-row border-b justify-between">
      <Image src="/MyList.svg" alt="" width={100} height={100} />
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap">
          {/* All List */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Manga */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/manga">Manga</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Anime */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/anime">Anime</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Movies */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/movies">Movies</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/movies">Favorite</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList>
          {/* Login */}
          <NavigationMenuItem>
            <Button variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </NavigationMenuItem>

          {/* Sign Up */}
          {/* Assuming "signin" means "sign up" or "register" */}
          <NavigationMenuItem>
            <Button>
              <Link href="/signin">Sign Up</Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
