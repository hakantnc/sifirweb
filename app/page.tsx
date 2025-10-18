import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TurkeyMap from "@/components/TurkeyMap";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TurkeyMap />
      </main>
    </div>
  );
}
