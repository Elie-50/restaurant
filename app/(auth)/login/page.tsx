import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getUserFromCookies } from "@/lib/auth";

export default async function LoginPage() {
  const token = await getUserFromCookies();

  if (token) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}