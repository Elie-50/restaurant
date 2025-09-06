"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/category";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemForm from "@/components/MenuItemForm";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  ingredients: string;
  imageUrl: string;
  categoryId: string;
};

export default function MenuItemsManager() {
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Fetch menu items for the current category
  useEffect(() => {
    if (!selectedCategory) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/menu-items?categoryId=${selectedCategory}`);
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Failed to fetch menu items", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col gap-4">
      {/* Categories navbar */}
      <nav className="flex border-b overflow-x-auto gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              selectedCategory === cat.id
                ? "text-red-600 border-red-600"
                : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Menu items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading && <p className="text-gray-500">Loading menu items...</p>}

        {!loading &&
          menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onDeleted={(id) =>
                setMenuItems(menuItems.filter((i) => i.id !== id))
              }
              onUpdated={(updated) =>
                setMenuItems(
                  menuItems.map((i) => (i.id === updated.id ? updated : i))
                )
              }
            />
          ))}

        {/* Add new item form */}
        {selectedCategory && (
          <MenuItemForm
            categoryId={selectedCategory}
            onCreated={(newItem) => setMenuItems([...menuItems, newItem])}
          />
        )}
      </div>
    </div>
  );
}
