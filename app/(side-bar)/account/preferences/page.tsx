/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import OptionButton from "@/components/OptionButton";
import { Loader2 } from "lucide-react";
import Spinner from "@/components/Spinner";

type DietaryOption = {
  id: number;
  label: string;
};

export default function PreferencesPage() {
  const [options, setOptions] = useState<DietaryOption[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loadingDiet, setLoadingDiet] = useState<boolean>(true);

  // fetch all available dietary options
  useEffect(() => {
    async function fetchOptions() {
      const res = await fetch("/api/dietary-options");
      const data = await res.json();
      setOptions(data);
    }

    async function fetchUserPreferences() {
      const res = await fetch("/api/user/dietary-preferences");
      const data = await res.json();
      setSelected(data.map((p: any) => p.dietaryOptionId));
      setLoadingDiet(false);
    }

    fetchOptions();
    fetchUserPreferences();
  }, []);

  // handle add/remove
  async function toggleOption(optionId: number, checked: boolean) {
    setLoadingId(optionId);

    try {
      if (checked) {
        await fetch("/api/user/dietary-preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dietaryOptionId: optionId }),
        });
        setSelected((prev) => [...prev, optionId]);
      } else {
        await fetch(`/api/user/dietary-preferences/${optionId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
        setSelected((prev) => prev.filter((id) => id !== optionId));
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="py-10">
        <h1 className="page-header">My preferences</h1>
        <h3 className="page-sub-header">Dietary preferences</h3>
        <div className="flex flex-wrap justify-center">
            {
            loadingDiet 
            ? 
            <Spinner minScreen />
            :
            options.map((opt) => {
                const isChecked = selected.includes(opt.id);
                const isLoading = loadingId === opt.id;

                return (
                <div
                    key={opt.id}
                    className="relative flex items-center justify-center"
                >
                    <OptionButton
                    type="checkbox"
                    label={opt.label}
                    value={String(opt.id)}
                    checked={isChecked}
                    loading={isLoading}
                    onChange={(e) =>
                        toggleOption(opt.id, (e.target as HTMLInputElement).checked)
                    }
                    />

                    {isLoading && (
                    <span className="absolute pr-2 right-2">
                        <Loader2 className="animate-spin w-4 h-4 text-red-600" />
                    </span>
                    )}
                </div>
                );
            })}
        </div>
        <div>
            <h3 className="page-sub-header">Favourite meals</h3>
        </div>
    </div>
  );
}
