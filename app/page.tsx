import { FaqSection } from "@/components/faq";
import { FeatureSection } from "@/components/feature";
import { HeroSection } from "@/components/hero";
import { FooterSection } from "@/components/shared/footer";
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
        <FaqSection/>
      </main>
      <footer>
        <FooterSection/>
      </footer>
    </div>
  );
}
