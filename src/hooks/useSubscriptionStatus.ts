import { useUser } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { getUserSubscriptionLevel } from "@/lib/getSubscriptionLevel";
import type { Subscription } from "@supabase/supabase-js";
import type { SubscriptionLevel } from "@/lib/types";

export const useSubscriptionStatus = () => {
  const { user, isLoaded } = useUser();
  const [subscriptionLevel, setSubscriptionLevel] = useState<
    SubscriptionLevel | undefined
  >(undefined);
  // useState<SubscriptionLevel>("free");

  useEffect(() => {
    async function checkSubscription() {
      if (!isLoaded || !user) return;
      const level = await getUserSubscriptionLevel(user.id);
      setSubscriptionLevel(level);
    }
    checkSubscription();
  }, [user, isLoaded]);

  return subscriptionLevel;
};
