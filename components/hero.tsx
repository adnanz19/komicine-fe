import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroProps {
  badge?: string;
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image?: {
    src: string;
    alt: string;
  };
}

const HeroSection = ({
  badge = "🎬 Teman Nonton & Baca Kamu",
  heading = "Dunia Cerita Visual dalam Satu Genggaman",
  description = "Dari anime musiman, manhwa aksi, sampai film box office. Simpan semua judul yang kamu suka dan catat sejauh mana kamu menikmatinya, tanpa ribet.",
  buttons = {
    primary: {
      text: "Buat Akun Gratis",
      url: "/register",
    },
    secondary: {
      text: "Jelajahi Koleksi",
      url: "/explore",
    },

  },
  image = {
    src: "/img-landing.svg",
    alt: "Hero section demo image showing interface components",
  },
}: HeroProps) => {
  return (
    <section className="py-20 px-10">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline">
                {badge}
              </Badge>
            )}
            <h1 className="py-6 text-pretty text-4xl font-bold lg:text-6xl text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <Image src={image.src} alt={image.alt} width={500} height={500}/>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
