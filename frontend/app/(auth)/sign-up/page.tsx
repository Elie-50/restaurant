"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorLine from "@/components/ErrorLine";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/signup", form);
      if (res.status === 201) {
        router.push("/login");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h1 className="text-2xl font-bold text-center">Sign Up</h1>

      <Input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        autoComplete="off"
      />
      <Input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <Input
        name="confirm"
        type="password"
        placeholder="Confirm Password"
        value={form.confirm}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <Input
          className="w-1/2"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />
        <Input
          className="w-1/2"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />
      </div>

      {error && <ErrorLine text={error} />}

      <Button
        type="submit"
        disabled={loading}
        variant="default"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </Button>

      <p>Already have an account? {" "}
        <Link className="auth-link" href={'/login'}>
          Log in
        </Link>
      </p>
    </form>
  );
}
