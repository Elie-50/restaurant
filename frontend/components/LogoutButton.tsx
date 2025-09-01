"use client";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/constants";
import { getCSRFToken } from "@/utils/functions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const csrfToken = getCSRFToken();
      await fetch(`${API_URL}/auth/logout/`, { 
        method: "POST",
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken!
        },
      });

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
      className="flex hover:bg-red-200 items-center space-x-2 my-2 border-red-500 text-red-500 hover:text-red-600 hover:border-red-600"
    >
      <LogOut className="h-7 w-7" />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </Button>
  );
}

export default LogoutButton;