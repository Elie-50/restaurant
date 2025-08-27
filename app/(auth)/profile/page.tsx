import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  UserCircleIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ShieldExclamationIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

async function Profile() {
    const cookieStore = cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
        headers: {
            Cookie: cookieStore.toString(), // forward cookies to your API
        },
        cache: "no-store", // prevent caching if you want fresh data
    });

    const data = await res.json();
    const user = data.user;

    if (!user) {
        redirect("/login");
    }

    const joinedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(user.createdAt));


    return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <UserCircleIcon className="h-6 w-6 text-gray-600" />
          <span className="text-lg font-medium">
            {user.firstName} {user.lastName} (@{user.username})
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <EnvelopeIcon className="h-6 w-6 text-gray-600" />
          <span className="text-lg">{user.email}</span>
        </div>

        <div className="flex items-center space-x-3">
          <IdentificationIcon className="h-6 w-6 text-gray-600" />
          <span className="text-lg capitalize">Account type: {user.role}</span>
        </div>

        <div className="flex items-center space-x-3">
          <CalendarDaysIcon className="h-6 w-6 text-gray-600" />
          <span className="text-lg">Joined on {joinedDate}</span>
        </div>

        <div className="flex items-center space-x-3">
          {user.isVerified ? (
            <>
              <CheckBadgeIcon className="h-6 w-6 text-green-600" />
              <span className="text-lg text-green-700">Verified</span>
            </>
          ) : (
            <>
              <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
              <span className="text-lg text-red-700">Not Verified</span>
            </>
          )}
        </div>

        <div className="py-2">
            <Link href={'/edit-profile'}>
                <Button>
                    Edit Profile
                </Button>
            </Link>
            <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default Profile;
