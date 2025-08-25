import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side: form */}
      <div className="flex flex-col items-center justify-center p-6 bg-transparent">
        <h1 className="text-3xl font-bold mb-2 hidden lg:block">DSS</h1>
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side: image */}
      <div className="hidden lg:block relative">
        <Image
          src="/mashewe.jpg"
          alt="Auth background"
          fill
          className="object-cover rounded-tl-3xl rounded-bl-3xl"
        />
      </div>

      {/* Mobile background */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <Image
          src="/mashewe.jpg"
          alt="Auth background"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
