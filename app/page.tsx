import HeroGSAP from "@/components/client/HeroGSAP";
import Hero from "@/components/server/Hero";

export default async function Home() {
  return (
    <>
      <main className="planks min-h-screen">
        <div className="lg:max-w-7xl lg:mx-auto lg:p-4">
        <HeroGSAP />
        <Hero />
        </div>
      </main>
    </>
  );
}
