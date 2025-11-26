import { FeatureSection } from "@/components/feature";
import { HeroSection } from "@/components/hero";
import { Navbar } from "@/components/shared/navbar";
import { TeamSection } from "@/components/team";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <main>
        <HeroSection/>
        <FeatureSection/>
        <TeamSection/>
      </main>
    </div>
  );
}
