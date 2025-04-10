import { useCallback, useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";

type RequestType = {
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: number;
  stripeCancelAtPeriodEnd?: boolean;
};

type ResponseType = Id<"subscriptions"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateSubscription = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const convex = getConvexClient();

  const mutate = useCallback(async (values: RequestType, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setStatus("pending");

      // const response = await mutation(values);
      const response = await convex.mutation(
        api.subscriptions.createSubscription,
        values,
      );

      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      setStatus("error");
      options?.onError?.(error as Error);
      if (options?.throwError) {
        throw error;
      }
    } finally {
      setStatus("settled");
      options?.onSettled?.();
    }
  }, []);

  return {
    mutate,
    data,
    error,
    isSuccess,
    isSettled,
    isError,
    isPending,
  };
};
