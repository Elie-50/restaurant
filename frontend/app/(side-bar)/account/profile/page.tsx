/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldX,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import Spinner from "@/components/Spinner";

export default function ProfilePage() {
  const { user, checkAuth, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (loading) {
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  if (user)
  return (
    <div className="mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="page-header">Profile</h2>
      <div className="flex items-center gap-4 mb-6">
        <UserCircle className="h-12 w-12 text-gray-500" />
        <div>
          <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-500 text-sm capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-3">
        <ProfileItem icon={User} label="Username" value={user.username} />
        <ProfileItem icon={Mail} label="Email" value={user.email} />
        <ProfileItem icon={Phone} label="Phone" value={user.phoneNumber} />
        <ProfileItem
          icon={user.isVerified ? ShieldCheck : ShieldX}
          label="Verified"
          value={user.isVerified ? "Yes" : "No"}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => router.push("/account/profile/edit")}>Edit Profile</Button>
      </div>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <Icon className="h-5 w-5 text-gray-600" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}
