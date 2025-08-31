/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorLine from "@/components/ErrorLine";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login/", // Django backend
        {
          username: form.username,
          password: form.password,
        },
        {
          withCredentials: true, // important: stores session cookie
        }
      );

      if (res.status === 200) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <Input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      {error && <ErrorLine text={error} />}

      <Button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      <Button variant="link">Forgot password?</Button>

      <p>
        Don&apos;t have an account yet?{" "}
        <Link className="auth-link" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
