"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUser } from "@/redux/slices/authSlice";
import ErrorLine from "../server/ErrorLine";

type User = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export default function UpdateProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth)

  const [form, setForm] = useState<User>({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = await dispatch(updateUser(form));

    if (data.meta.requestStatus === 'fulfilled') {
      router.push('/account/profile');
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
        {
          error && <ErrorLine text={error} />
        }

        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/account/profile")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
