import UpdateProfileForm from "@/components/client/UpdateProfileForm";
import { getCurrentUser } from "@/lib/auth";

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="p-6 text-center">You must be logged in to edit your profile.</div>;
  }

  const { firstName, lastName, phoneNumber } = user;

  return <UpdateProfileForm user={{ firstName, lastName, phoneNumber }} />;
}
