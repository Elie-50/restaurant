import UpdateProfileForm from "@/components/client/UpdateProfileForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function EditProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  return <UpdateProfileForm user={user} />
}

export default EditProfilePage
