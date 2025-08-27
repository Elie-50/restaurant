import Navbar from "@/components/Navbar";
import Image from "next/image";
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

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
      <div className="absolute inset-0 -z-10">
        <Image
          src="/vintage-planks.jpg"
          alt="Hero background"
          fill
          className="object-cover"
        />
      </div>
      <Navbar isAuthenticated={isAuthenticated} />
    </>
  );
}
