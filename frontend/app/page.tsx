import Navbar from "@/components/Navbar";
import HeroGSAP from "@/components/HeroGSAP";
import Hero from "@/components/Hero";

export default async function Home() {
  return (
    <>
      <main className="planks">
        <div className="lg:max-w-7xl lg:mx-auto lg:p-4">
        <Navbar isAuthenticated={false} />
        <HeroGSAP />
        <Hero />
        </div>
      </main>
    </>
  );
}
