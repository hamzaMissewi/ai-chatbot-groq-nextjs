import { useUser } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export const useUpdateUserProfile = () => {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const convex = getConvexClient();

  const updateProfile = useCallback(
    async (data: { file?: File; name?: string }) => {
      if (!user || !isLoaded) {
        toast.error("User not authenticated");
        return;
      }

      try {
        setIsUpdating(true);

        // const formData= new FormData()
        // Upload image to Clerk
        // formData.append("file", file);

        // Update Clerk user data
        if (data.name) {
          await user.update({
            firstName: data.name,
          });
        }

        let imageUrl: string | null = user.imageUrl;

        if (data.file) {
          const response = await user.setProfileImage({ file: data.file });

          if (!response) {
            throw new Error("Failed to update avatar");
          }

          // imageUrl = URL.createObjectURL(data.file);

          imageUrl = response.publicUrl;
        }

        // Update Convex document
        await convex.mutation(api.users.updateUser, {
          clerkUserId: user.id,
          name: data.name || user.fullName || undefined,
          email: user.primaryEmailAddress?.emailAddress,
          imageUrl: imageUrl || undefined,
        });

        toast.success("Avatar updated successfully");
      } catch (error) {
        console.error("Error updating avatar:", error);
        toast.error("Failed to update avatar");
      } finally {
        setIsUpdating(false);
      }
    },
    [user, isLoaded, convex],
  );

  return {
    updateProfile,
    isUpdating,
  };
};

// export const useUpdateUser = () => {
//   const { user, isLoaded } = useUser();
//   const [isUpdating, setIsUpdating] = useState(false);
//   const convex = getConvexClient();

//   const updateAvatar = useCallback(
//     async (file: File) => {
//       if (!user || !isLoaded) {
//         toast.error("User not authenticated");
//         return;
//       }

//       try {
//         setIsUpdating(true);

//         // Upload image to Clerk
//         const formData = new FormData();
//         formData.append("file", file);

//         const response = await user.setProfileImage({ file });

//         if (!response) {
//           throw new Error("Failed to update avatar");
//         }

//         // Get the new image URL
//         const imageUrl = user.imageUrl;

//         // Update user data in Convex
//         await convex.mutation(api.users.updateUser, {
//           clerkUserId: user.id,
//           imageUrl,
//         });

//         toast.success("Avatar updated successfully");
//       } catch (error) {
//         console.error("Error updating avatar:", error);
//         toast.error("Failed to update avatar");
//       } finally {
//         setIsUpdating(false);
//       }
//     },
//     [user, isLoaded, convex],
//   );

//   return {
//     updateAvatar,
//     isUpdating,
//   };
// };
