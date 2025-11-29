import { FaqSection } from "@/components/faq";
import { FeatureSection } from "@/components/feature";
import { HeroSection } from "@/components/hero";
import { FooterSection } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { TeamSection } from "@/components/team";

export default function Home() {
  return (
    <div>
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
