"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import AddressCard from "@/components/AddressCard";
import Spinner from "@/components/Spinner";

type Address = {
  id: string;
  street: string;
  building: string;
  city: string;
  apartment?: string;
  gpsLink?: string;
  imageUrl?: string;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAddresses() {
    const res = await fetch("/api/addresses");
    const data = await res.json();
    setAddresses(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <h1 className="page-header">My Addresses</h1>
        { addresses.length === 0 && <p className="text-center mt-10">No addresses added yet</p>}
      <div className="space-y-4">
        {addresses.map((address) => (
          <AddressCard 
            key={address.id}
            id={address.id}
            street={address.street}
            city={address.city}
            apartment={address.apartment}
            handleDelete={handleDelete}
            building={address.building}
            imageUrl={address.imageUrl}
            gpsLink={address.gpsLink}
          />
        ))}
      </div>

      {/* Floating Action Button to add new address */}
      <Link href="/account/addresses/new">
        <div className="bg-foreground text-primary fixed bottom-6 right-6 rounded-full w-16 h-16 flex items-center justify-center p-0">
          <Plus className="w-8 h-8" />
        </div>
      </Link>
    </div>
  );
}
