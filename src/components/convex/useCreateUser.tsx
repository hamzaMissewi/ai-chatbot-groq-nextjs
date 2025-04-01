"use client";
import { useUser } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export const useCreateUser = () => {
  const { user, isLoaded } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const convex = getConvexClient();

  const createUser = useCallback(async () => {
    if (!user || !isLoaded) {
      return;
    }
    try {
      setIsCreating(true);
      const convexUser = await convex.query(api.users.getUser, {
        userId: user.id,
      });
      if (!convexUser) {
        await convex.mutation(api.users.createUser, {
          userId: user.id,
          name: user.fullName || undefined,
          email: user.primaryEmailAddress?.emailAddress,
          imageUrl: user.imageUrl,
        });
      }
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar");
    } finally {
      setIsCreating(false);
    }
  }, [user, isLoaded, convex]);

  return {
    createUser,
    isCreating,
  };
};
