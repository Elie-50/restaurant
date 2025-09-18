import { getCurrentUser, getUserFromCookies } from "@/lib/auth";
import * as react from "react";
import { User, Mail, Phone, UserCircle, LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Icon = react.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
>;

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="p-6 text-center">You must be logged in to view this page.</div>;
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-2xl shadow max-w-md">
      <h2 className="page-header">Profile</h2>
      <div className="flex items-center gap-4 mb-6">
        <UserCircle className="h-12 w-12 text-gray-500" />
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 text-sm capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-3">
        <ProfileItem icon={User} label="Username" value={user.username} />
        <ProfileItem icon={Mail} label="Email" value={user.email} />
        <ProfileItem icon={Phone} label="Phone" value={user.phoneNumber} />
      </div>

      <div className="mt-6 flex justify-end">
        <Button>
          <Link href={'/account/profile/edit'}>
            Edit Profile
          </Link>
          
        </Button>
      </div>
    </div>
  );
}

export function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: Icon;
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