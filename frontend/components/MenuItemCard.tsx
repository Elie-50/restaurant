"use client";

import Image from "next/image";
import { Pencil, Trash2, Eye } from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  ingredients: string;
  imageUrl: string;
  categoryId: string;
};

type Props = {
  item: MenuItem;
  onDeleted: (id: string) => void;
  onUpdated: (item: MenuItem) => void;
};

export default function MenuItemCard({ item, onDeleted, onUpdated }: Props) {
  const handleDelete = async () => {
    try {
      await fetch(`/api/menu-items/${item.id}`, { method: "DELETE" });
      onDeleted(item.id);
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const handleEdit = async () => {
    // placeholder edit logic (you might open a modal or inline form)
    const res = await fetch(`/api/menu-items/${item.id}`);
    const updated = await res.json();
    onUpdated(updated);
  };

  return (
    <div className="relative group border rounded-2xl shadow-sm overflow-hidden bg-white">
      {/* Delete button (top corner) */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hidden group-hover:block hover:bg-red-100"
      >
        <Trash2 size={16} className="text-red-500" />
      </button>

      {/* Image */}
      <div className="relative w-full h-40">
        <Image
          src={'/classic-burger.png'}
          alt={item.name}
          height={200}
          width={200}
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.ingredients}</p>
        <p className="mt-1 font-bold text-red-600">${item.price}</p>
      </div>

      {/* Hover actions (bottom) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-2">
        <button
          onClick={handleEdit}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => alert("Preview not implemented")}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <Eye size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
