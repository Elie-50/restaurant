import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import SignupForm from "@/components/client/SignupForm";

export default async function SignupPage() {
  const token = (await cookies()).get("token")?.value;

  if (token) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
