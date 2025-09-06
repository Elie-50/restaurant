"use client";

import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCSRFToken } from "@/utils/functions";
import { ME_URL } from "@/lib/constants";

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const formTransfrom = () => ({
    first_name: form.firstName,
    last_name: form.lastName,
    phone_number: form.phoneNumber
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newForm = formTransfrom();
      const csrfToken = getCSRFToken();
      const res = await axios.put(ME_URL, newForm, { 
        headers: {
          "X-CSRFToken": csrfToken!,
        },
        withCredentials: true,
      });
      setUser(res.data.user);
      router.push("/account/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">First Name</label>
          <Input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Last Name</label>
          <Input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Phone Number</label>
          <Input
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
        </div>

        <div className=" flex flex-col gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/account/profile")}>
            Cancel
          </Button>
          
        </div>
      </form>
    </div>
  );
}
