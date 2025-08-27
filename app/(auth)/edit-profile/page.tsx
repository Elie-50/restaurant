/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth"; // adjust path if needed
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

function EditProfile() {
  const { user, setUser, checkAuth } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    checkAuth(); // ensure store has user
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      });
      setErrorMsg(null);
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.put(
        "/api/auth/me",
        form,
        { withCredentials: true }
      );
      setUser(res.data.user); // update store with new user
      router.push('/profile');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <p>Please log in to edit your profile.</p>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground font-bold text-center">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground mb-2" htmlFor="username">Username</Label>
            <Input
            className="text-foreground"
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <Label className="text-foreground mb-2" htmlFor="email">Email</Label>
            <Input
              className="text-foreground"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <div className="flx flex-col">
                <Label className="text-foreground mb-2" htmlFor="firstName">First Name</Label>
                <Input
                    className="w-1/2 text-foreground"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                />
            </div>
            
            <div className="flex flex-col">
                <Label className="text-foreground mb-2" htmlFor="lastName">Last Name</Label>
                <Input
                    className="w-1/2 text-foreground"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                />
            </div>
            
        </div>

          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-foreground">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditProfile;
