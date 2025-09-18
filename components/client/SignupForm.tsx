"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import ErrorLine from "@/components/server/ErrorLine";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signup } from "@/redux/slices/authSlice";

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const res = await dispatch(signup(form));

    if (res.meta.requestStatus == 'fulfilled') {
      router.push('/account/profile');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create to your account</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            placeholder="Username"
            name="username"
            id="username"
            type="username"
            required
            value={form.username}
            onChange={handleChange} 
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Password"
            name="password"
            id="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange} 
          />
        </div>
        <div className="flex flex-row gap-2">
          <div className="grid gap-3 w-1/2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              placeholder="First Name"
              name="firstName"
              id="firstName"
              type="firstName"
              required
              value={form.firstName}
              onChange={handleChange} 
            />
          </div>
          <div className="grid gap-3 w-1/2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              placeholder="Last Name"
              name="lastName"
              id="lastName"
              type="lastName"
              required
              value={form.lastName}
              onChange={handleChange} 
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          { loading ? 'Signing up...' : 'Sign Up' }
        </Button>
        {
          error && <ErrorLine text={error} />
        }
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
