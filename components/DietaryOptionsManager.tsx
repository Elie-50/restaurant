/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DietaryOption = {
  id: string;
  label: string;
};

export default function DietaryOptionsManager() {
  const [options, setOptions] = useState<DietaryOption[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all options on load
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dietary-options");
        if (!res.ok) throw new Error("Failed to fetch options");
        const data = await res.json();
        setOptions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/dietary-options/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete option");
      setOptions(options.filter((o) => o.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newLabel.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/dietary-options/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel }),
      });
      if (!res.ok) throw new Error("Failed to update option");
      const updated = await res.json();
      setOptions(options.map((o) => (o.id === id ? updated : o)));
      setEditingId(null);
      setNewLabel("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newLabel.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dietary-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel }),
      });
      if (!res.ok) throw new Error("Failed to create option");
      const created = await res.json();
      setOptions([...options, created]);
      setCreating(false);
      setNewLabel("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Options list */}
      <div className="flex items-center flex-wrap gap-3">
        {options.map((opt) => (
          <div key={opt.id} className="relative group">
            {editingId === opt.id ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-blue-400 bg-blue-50">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-transparent outline-none text-sm font-medium"
                  autoFocus
                  disabled={loading}
                />
                <button
                  onClick={() => handleUpdate(opt.id)}
                  disabled={loading}
                  className="p-1 hover:cursor-pointer rounded-full hover:bg-blue-100 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  ) : (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setNewLabel("");
                  }}
                  disabled={loading}
                  className="p-1 hover:cursor-pointer rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <>
                <span
                  className={cn(
                    "px-4 py-2 rounded-full font-medium border-2 transition hover:cursor-default",
                    "border-gray-400 bg-gray-200 text-gray-700 group-hover:pr-16"
                  )}
                >
                  {opt.label}
                </span>

                {/* Hover actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(opt.id);
                      setCreating(false);
                      setNewLabel(opt.label);
                    }}
                    disabled={loading}
                    className="p-1 hover:cursor-pointer bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Pencil size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(opt.id)}
                    disabled={loading}
                    className="p-1 hover:cursor-pointer bg-white rounded-full shadow hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add button OR inline input */}
        {creating ? (
          <div className="flex my-2 items-center gap-2 px-4 py-2 rounded-full border-2 border-green-400 bg-green-50">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium"
              placeholder="New option..."
              autoFocus
              disabled={loading}
            />
            <button
              onClick={handleCreate}
              disabled={loading}
              className="p-1 hover:cursor-pointer rounded-full hover:bg-green-100 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-green-600" />
              ) : (
                <Check size={16} className="text-green-600" />
              )}
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setNewLabel("");
              }}
              disabled={loading}
              className="p-1 hover:cursor-pointer rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
                setCreating(true);
                setNewLabel("");
                setEditingId(null);
            }}
            disabled={loading}
            className="flex my-2 hover:cursor-pointer items-center gap-1 px-4 py-2 rounded-full font-medium border-2 border-dashed border-gray-400 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <Plus size={16} /> Add Option
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
