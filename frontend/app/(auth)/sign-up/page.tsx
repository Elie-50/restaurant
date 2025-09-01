/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorLine from "@/components/ErrorLine";
import Link from "next/link";
import { SIGNUP_URL } from "@/lib/constants";

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
    if (form.password !== form.confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        SIGNUP_URL,
        {
          username:form.username,
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        router.push("/login");
      }
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
      <h1 data-testid="header" className="text-2xl font-bold text-center">Sign Up</h1>

      <Input
        data-testid="username-input"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        autoComplete="off"
      />
      <Input
        data-testid="email-input"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        data-testid="password-input"
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <Input
        data-testid="password-confirm"
        name="confirm"
        type="password"
        placeholder="Confirm Password"
        value={form.confirm}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <Input
          data-testid="firstname-input"
          className="w-1/2"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />
        <Input
          data-testid="lastname-input"
          className="w-1/2"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />
      </div>

      {error && <ErrorLine text={error} />}

      <Button
        data-testid="submit-button"
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
