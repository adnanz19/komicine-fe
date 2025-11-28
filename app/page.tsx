import { FeatureSection } from "@/components/feature";
import { HeroSection } from "@/components/hero";
import { TeamSection } from "@/components/team";

export default function Home() {
  return (
    <div>
      <main>
        <HeroSection />
        <FeatureSection />
        <TeamSection />
      </main>
    </div>
  );
}
