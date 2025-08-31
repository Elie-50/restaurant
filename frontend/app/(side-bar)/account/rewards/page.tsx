import ErrorLine from "@/components/ErrorLine";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";
import { cookies } from "next/headers";

async function AccountRewards() {
  let points;

  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("sessionid")?.value;

    const res = await fetch("http://localhost:8000/api/users/me/points/", {
      headers: {
        cookie: `sessionid=${sessionCookie}`,
      },
    });
    
    const data = await res.json();
    points = data.points;
  } catch {
    return <ErrorLine text="Failed to fetch points" />;
  }

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="page-header">My rewards</h2>
      <p className="text-gray-600 text-lg text-center font-semibold mb-4">
        Earn points every time you place an order with the DSS app.
      </p>
      <div className="max-w-2xl mb-4 mx-auto p-6 bg-white rounded-2xl shadow">
        <p className="text-gray-600 text-md text-center font-semibold mb-4">
          You are {200 - points} points away from a $5 reward!
        </p>
        <Link className="flex items-center justify-center" href="/account/order">
          <div className="flex flex-row order-now items-center justify-center w-full lg:w-fit">
            <span className="text-sm">Order Now</span>
            <ArrowRightCircle className="w-5 h-5 mx-2" />
          </div>
        </Link>
      </div>
      <p className="p-4 text-md text-gray-700 font-semibold">
        You have {points} points earned.
      </p>
      <div className="relative w-full">
        <Progress
          className="h-7 [&>div]:bg-red-500 transition"
          value={Math.min(100, (points / 200) * 100)}
        />
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-100">
          {Math.min(100, (points / 200) * 100)}%
        </span>
      </div>
    </div>
  );
}

export default AccountRewards;
