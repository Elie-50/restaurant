/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import AddressCard from "@/components/AddressCard";
import Spinner from "@/components/Spinner";
import { ADDRESSES_URL } from "@/lib/constants";
import { getCSRFToken } from "@/utils/functions";

type Address = {
  id: string;
  street: string;
  city: string;
  building: string;
  floor?: string;
  gpsLink?: string;
  imageUrl?: string;
  createdAt: Date;
};

type AddressResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Address[];
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressResponse>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [loading, setLoading] = useState(true);

  async function fetchAddresses() {
    const res = await fetch(ADDRESSES_URL, { credentials: "include" });
    const data = await res.json();

    // Map snake_case → camelCase
    const transformed = {
      ...data,
      results: data.results.map((a: any) => ({
        id: a.id,
        street: a.street,
        city: a.city,
        building: a.building,
        floor: a.floor,
        gpsLink: a.gps_link || undefined,
        imageUrl: a.image || undefined,
        createdAt: new Date(a.created_at),
      })),
    };

    setAddresses(transformed);
    setLoading(false);
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    const csrfToken = getCSRFToken();

    await fetch(`${ADDRESSES_URL}${id}/`, { 
      method: "DELETE",
      credentials: 'include',
      headers: {
        "X-CSRFToken": csrfToken!,
      }
    });
    setAddresses((prev) => ({
      ...prev,
      results: prev.results.filter((a) => a.id !== id),
    }));
  }


  return (
    <div className="p-6">
      <h1 className="page-header">My Addresses</h1>
        { (addresses.results.length === 0 && !loading) && <p className="text-center mt-10">No addresses added yet</p>}
      <div className="space-y-4">
        {
        loading ?
        <Spinner />
        :
        addresses.results.map((address) => (
          <AddressCard 
            key={address.id}
            id={address.id}
            street={address.street}
            city={address.city}
            floor={address.floor}
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
