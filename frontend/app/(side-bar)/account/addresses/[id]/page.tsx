"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import Image from "next/image";
import Spinner from "@/components/Spinner";

type Address = {
  id?: string;
  street: string;
  building: string;
  city: string;
  apartment?: string;
  gpsLink?: string;
  imageUrl?: string; // URL from backend
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditAddressPage({ params }: Props) {
  const router = useRouter();
  const { id } = React.use(params);
  const [address, setAddress] = useState<Address>({
    street: "",
    building: "",
    city: "",
    apartment: "",
    gpsLink: "",
    imageUrl: "",
  });
  
  const [file, setFile] = useState<File | null>(null); // new file state
  const isNew = id === "new";

  const [loading, setLoading] = useState<boolean>(!isNew);

  // Load existing address
  useEffect(() => {
    if (!isNew) {
      fetch(`/api/addresses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setAddress(data);
          setLoading(false);
        });
    }
  }, [id, isNew]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("street", address.street);
    formData.append("building", address.building);
    formData.append("city", address.city);
    if (address.apartment) formData.append("apartment", address.apartment);
    if (address.gpsLink) formData.append("gpsLink", address.gpsLink);
    if (file) formData.append("image", file); // append file if selected

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/addresses" : `/api/addresses/${id}`;

    await fetch(url, {
      method,
      body: formData,
    });

    router.push("/account/addresses");
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isNew ? "Add New Address" : "Edit Address"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Street" value={address.street} onChange={(v) => setAddress({ ...address, street: v })} required />
        <InputField label="Building" value={address.building} onChange={(v) => setAddress({ ...address, building: v })} required />
        <InputField label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} required />
        <InputField label="Apartment" value={address.apartment} onChange={(v) => setAddress({ ...address, apartment: v })} />
        <InputField label="GPS Link" value={address.gpsLink} onChange={(v) => setAddress({ ...address, gpsLink: v })} />

        {/* File input for image */}
        <div>
          <label htmlFor="image-field" className="block mb-1 font-semibold">Address Image</label>
          <input
            id="image-field"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Image preview */}
        {file ? (
          <Image
            src={URL.createObjectURL(file)}
            alt="Preview"
            width={200}
            height={200}
            className="w-32 h-32 object-cover rounded mt-2"
          />
        ) : address.imageUrl ? (
          <Image
            src={address.imageUrl}
            width={200}
            height={200}
            alt="Address"
            className="w-32 h-32 object-cover rounded mt-2"
          />
        ) : null}

        <Button type="submit">{isNew ? "Add Address" : "Update Address"}</Button>
      </form>
    </div>
  );
}

function InputField({ label, value, onChange, required }: { label: string; value?: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}
