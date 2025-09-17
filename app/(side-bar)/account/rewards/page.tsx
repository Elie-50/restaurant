import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountRewards() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-6 text-center">
        You must be logged in to view your rewards.
      </div>
    );
  }

  const points = user.points ?? 0;
  const rewardThreshold = 200;
  const percent = Math.min(100, (points / rewardThreshold) * 100);

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="page-header">My Rewards</h2>
      <p className="text-gray-600 text-lg text-center font-semibold mb-4">
        Earn points every time you place an order with the DSS app.
      </p>

      <div className="max-w-2xl mb-4 mx-auto p-6 bg-white rounded-2xl shadow">
        <p className="text-gray-600 text-md text-center font-semibold mb-2">
          You are {rewardThreshold - points} points away from a $5 reward!
        </p>

        <div className="relative w-full">
          <Progress
            className="h-7 [&>div]:bg-red-500 transition"
            value={percent}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-100">
            {percent}%
          </span>
        </div>
      </div>

      <p className="p-4 text-md text-gray-700 font-semibold text-center">
        You have {points} points earned.
      </p>
    </div>
  );
}
