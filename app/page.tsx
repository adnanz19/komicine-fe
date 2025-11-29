import { FaqSection } from "@/components/faq";
import { FeatureSection } from "@/components/feature";
import { HeroSection } from "@/components/hero";
import { FooterSection } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { TeamSection } from "@/components/team";
import { BackgroundBeamsWithCollision } from "@/components/ui/shadcn-io/background-beams-with-collision";

export default function Home() {
  return (
    <BackgroundBeamsWithCollision className="relative pb-20 px-6 md:px-10 overflow-hidden bg-background">
      <main className="min-h-screen z-20">
        <HeroSection/>
        <FeatureSection/>
        <TeamSection/>
        <FaqSection/>
      </main>
      <footer className="z-20">
        <FooterSection/>
      </footer>
    </BackgroundBeamsWithCollision>
  );
}