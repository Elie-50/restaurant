import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type AddressCardProps = {
  id: string;
  street: string;
  building: string;
  floor?: string;
  city: string;
  gpsLink?: string;
  imageUrl?: string;
  handleDelete: (id: string) => void;
};

function AddressCard({
  id,
  street,
  building,
  floor,
  city,
  gpsLink,
  imageUrl,
  handleDelete,
}: AddressCardProps) {
  return (
    <Card className="relative flex flex-col md:flex-row overflow-hidden shadow-lg rounded-xl border border-gray-200">
      {/* Delete Button (Top-Right) */}
      <button
        onClick={() => handleDelete(id)}
        className="absolute top-3 right-3 hover:cursor-pointer bg-white/80 hover:bg-red-100 text-red-600 p-2 rounded-full shadow-md transition"
        aria-label="Delete Address"
      >
        <Trash className="w-[18px] h-[18px]" />
      </button>

      {/* Image */}
      <div className="w-full px-4 md:w-60 h-48 md:h-auto flex-shrink-0 bg-gray-100">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt="Address"
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <CardContent className="p-0 mb-4">
          <p className="text-lg text-gray-700 font-semibold">
            {street}, {building}
            {floor ? `, Apt ${floor}` : ""}
          </p>
          <p className="text-gray-600">{city}</p>
          {gpsLink && (
            <a
              href={gpsLink}
              target="_blank"
              className="text-blue-600 underline text-sm"
              rel="noopener noreferrer"
            >
              View on Map
            </a>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Link href={`/account/addresses/${id}`}>
            <Button variant="secondary" size="sm">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AddressCard;
