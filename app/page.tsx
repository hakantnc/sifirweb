import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TreeInfoSection from "@/components/TreeInfoSection";
import TurkeyMap from "@/components/TurkeyMap";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TurkeyMap />

        <TreeInfoSection />
      </main>
    </div>
  );
}
