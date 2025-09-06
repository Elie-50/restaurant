import { create } from "zustand";
import axios from "axios";

export type Category = {
  id: string;
  label: string;
};

type CategoryState = {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  addCategory: (label: string) => Promise<void>;
  editCategory: (id: string, label: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],

  // Fetch all categories
  fetchCategories: async () => {
    try {
      const res = await axios.get<Category[]>("/api/food-categories");
      set({ categories: res.data });
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  },

  // Add a new category
  addCategory: async (label) => {
    try {
      const res = await axios.post<Category>("/api/food-categories", { label });
      set({ categories: [...get().categories, res.data] });
    } catch (err) {
      console.error("Failed to add category", err);
    }
  },

  // Edit a category
  editCategory: async (id, label) => {
    try {
      const res = await axios.put<Category>(`/api/food-categories/${id}`, { label });
      set({
        categories: get().categories.map((cat) =>
          cat.id === id ? res.data : cat
        ),
      });
    } catch (err) {
      console.error("Failed to edit category", err);
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      await axios.delete(`/api/food-categories/${id}`);
      set({
        categories: get().categories.filter((cat) => cat.id !== id),
      });
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  },
}));
