import {
  BatteryCharging,
  GitPullRequest,
  Layers,
  RadioTower,
  SquareKanban,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Feature {
  heading: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureProps {
  heading?: string;
  description?: string;
  features?: Feature[];
  buttonText?: string;
  buttonUrl?: string;
}

const FeatureSection = ({
  heading = "Fitur Unggulan Komicine",
  description = "Komicine hadir dengan berbagai fitur canggih yang dirancang khusus untuk para penggemar cerita visual. Nikmati pengalaman terbaik dalam melacak, menemukan, dan berbagi konten favoritmu.",
  features = [
    {
      heading: "Database Terlengkap",
      description:
        "Cari apa saja, pasti ketemu. Dari Anime klasik, Manga terbaru, Manhwa hits, hingga Film Box Office dalam satu database terintegrasi.",
      icon: <Layers className="size-6" />, // Cocok melambangkan tumpukan data
    },
    {
      heading: "Tracking Mudah",
      description:
        "Lupa sampai episode atau chapter berapa? Catat progress tontonan dan bacaanmu dengan satu klik. Tidak ada lagi cerita lupa alur.",
      icon: <SquareKanban className="size-6" />, // Melambangkan manajemen status/list
    },
    {
      heading: "Ringan & Cepat",
      description:
        "Dibangun dengan teknologi modern (Next.js) yang super cepat. Hemat kuota dan lancar diakses dari HP maupun Laptop.",
      icon: <BatteryCharging className="size-6" />, // Melambangkan efisiensi energi/kecepatan
    },
  ],
  // ... sisa kode props lain
}: FeatureProps) => {
  return (
    <section className="py-20 px-10">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          {heading}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl lg:text-xl">
          {description}
        </p>
      </div>
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col justify-center items-center text-center px-4">
              <div className="bg-accent mb-5 flex size-16 items-center justify-center rounded-full">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.heading}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FeatureSection };
