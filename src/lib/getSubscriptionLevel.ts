import { cache } from "react";
import { getConvexClient } from "./convex";
import { api } from "@/convex/_generated/api";
import type { SubscriptionLevel } from "./types";
// import { useQuery } from "convex/react";

export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel | undefined> => {
    try {
      const convex = await getConvexClient();
      const subscription = await convex.query(
        api.subscriptions.getUserSubscription,
        { userId },
      );

      if (!subscription) return;

      console.log("user subscription ", subscription);

      // Query user's subscription status from Convex
      // const subscription = useQuery(api.subscriptions.getUserSubscription, {
      //   userId: userId,
      // });

      // if (!subscription || subscription._creationTime < new Date()) {
      if (
        !subscription ||
        subscription.stripePriceId === "free_plan" ||
        !subscription?.stripeCurrentPeriodEnd ||
        subscription.stripeCurrentPeriodEnd < Date.now()
      ) {
        return "free";
      }

      if (
        subscription.stripePriceId ===
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
      ) {
        return "pro";
      }

      if (
        subscription.stripePriceId?.includes("pro_plus") ||
        subscription.stripePriceId ===
          process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
      ) {
        return "pro_plus";
      }

      // throw new Error("Invalid subscription");
    } catch (error) {
      throw new Error(`Invalid subscription, ${JSON.stringify(error)}`);
    }
  },
);
