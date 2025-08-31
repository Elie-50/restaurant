"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/SideBar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    // h-screen + flex + overflow-hidden ensures children control their own scroll
    <div className="h-screen flex overflow-hidden">
      <aside className="hidden md:flex flex-shrink-0 w-64 border-r bg-white">
        <div className="h-full w-full overflow-y-auto">
          <Sidebar onClick={() => { /* no-op on desktop */ }} />
        </div>
      </aside>

      {/* Mobile hamburger (visible < md) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md border bg-white shadow-md"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Drawer panel */}
          <div className="w-64 bg-white border-r h-full overflow-y-auto">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Sidebar onClick={() => setOpen(false)} />
          </div>

          {/* Scrim to close drawer when clicking outside */}
          <div
            className="flex-1"
            onClick={() => setOpen(false)}
            role="button"
            aria-hidden
          />
        </div>
      )}

      {/* Main content — has its own scroll */}
      <main className="flex-1 h-full overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}
