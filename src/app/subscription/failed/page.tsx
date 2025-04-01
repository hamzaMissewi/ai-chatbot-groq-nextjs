"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

export default function SubscriptionFailedPage() {
  const router = useRouter();
  const subscriptionLevel = useSubscriptionStatus();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <XCircle className="mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Subscription Failed
          </h1>
          <p className="mb-6 text-gray-600">
            We couldn't process your subscription. This might be due to:
          </p>
          <ul className="mb-8 space-y-2 text-left text-gray-600">
            <li>• Invalid payment information</li>
            <li>• Insufficient funds</li>
            <li>• Card restrictions</li>
            <li>• Technical issues</li>
          </ul>

          {/* Show current plan status */}
          {subscriptionLevel !== "free" && (
            <div className="mb-6 rounded-lg bg-indigo-50 p-4">
              <p className="text-sm text-indigo-700">
                Your current plan:{" "}
                <span className="font-semibold">
                  {subscriptionLevel === "pro_plus" ? "Pro+" : "Pro"}
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="min-w-[120px]"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/pricing")}
              className="min-w-[120px] bg-indigo-600 hover:bg-indigo-500"
            >
              {subscriptionLevel === "free" ? "Try Again" : "Upgrade Plan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
