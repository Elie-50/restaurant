import Navbar from "@/components/Navbar";
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import HeroGSAP from "@/components/HeroGSAP";
import Hero from "@/components/Hero";

export default async function Home() {

  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  let isAuthenticated = false

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!)
      isAuthenticated = true
    } catch (err) {
      console.error("Invalid token:", err)
    }
  }

  return (
    <>
      <main className="planks">
        <div className="lg:max-w-7xl lg:mx-auto lg:p-4">
        <Navbar isAuthenticated={isAuthenticated} />
        <HeroGSAP />
        <Hero />
        </div>
      </main>
    </>
  );
}
