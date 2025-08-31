/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Props = {
  categoryId: string;
  onCreated: (item: any) => void;
};

export default function MenuItemForm({ categoryId, onCreated }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      const res = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          ingredients,
          imageUrl,
          categoryId,
        }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const created = await res.json();
      onCreated(created);
      setName("");
      setPrice("");
      setIngredients("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl shadow-sm p-4 bg-gray-50 flex flex-col gap-2">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-md p-2 text-sm"
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border rounded-md p-2 text-sm"
      />
      <input
        type="text"
        placeholder="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="border rounded-md p-2 text-sm"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border rounded-md p-2 text-sm"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-md p-2 hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        Add Item
      </button>
    </div>
  );
}
