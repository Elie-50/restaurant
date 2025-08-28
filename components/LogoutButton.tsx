"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center space-x-2 my-2 border-red-500 text-red-500 hover:text-red-600 hover:border-red-600"
    >
      <ArrowRightOnRectangleIcon className="h-7 w-7" />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </Button>
  );
}

export default LogoutButton;