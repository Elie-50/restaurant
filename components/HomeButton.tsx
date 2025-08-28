"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

function HomeButton({ to='/' }: { to: string}) {
  const router = useRouter();

  return (
    <span className="hover:cursor-pointer"
      onClick={() => router.push(to)}
    >
      <ArrowLeftIcon className="h-7 w-7 text-foreground" />
    </span>
  );
}

export default HomeButton;