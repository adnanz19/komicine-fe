import { FaqSection } from "@/components/faq";
import { FeatureSection } from "@/components/feature";
import { HeroSection } from "@/components/hero";
import { FooterSection } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { TeamSection } from "@/components/team";
import { BackgroundBeamsWithCollision } from "@/components/ui/shadcn-io/background-beams-with-collision";
import { Particles } from "@/components/ui/shadcn-io/particles";

export default function Home() {
  return (
    <div className="relative pb-20 px-6 md:px-10 overflow-hidden bg-background">
      <main className="min-h-screen z-20">
        <HeroSection/>
        <FeatureSection/>
        <TeamSection/>
        <FaqSection/>
      </main>
      <footer className="z-20">
        <FooterSection/>
      </footer>

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        staticity={50}
        color="#ffffff"
        size={0.8}
      />
    </div>
  );
}