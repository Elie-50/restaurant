import Navbar from "@/components/Navbar";
import Image from "next/image";
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
      <Navbar isAuthenticated={isAuthenticated} />
      <HeroGSAP />
      <Hero />
    </>
  );
}
