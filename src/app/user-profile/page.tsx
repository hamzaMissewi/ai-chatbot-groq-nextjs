"use client";

import { useUser } from "@clerk/nextjs";
import { Camera, Eye } from "lucide-react";
import { useRef, useState } from "react";
import { LoadingCircle } from "@/components/Loading";
import { useUpdateUserProfile } from "@/components/hooks/useUpdateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarPreviewModal } from "@/components/AvatarPreviewModal";
import { toast } from "sonner";
import ProfileHeader from "./ProfileHeader";

export default function UserProfilePage() {
  const { user } = useUser();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { updateProfile, isUpdating: isProfileUpdating } =
    useUpdateUserProfile();

  const [showPreview, setShowPreview] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name?: string;
    imageUrl?: string;
  }>({
    name: user?.fullName || "",
    imageUrl: user?.imageUrl,
    // email: user?.primaryEmailAddress?.emailAddress || "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // toast.warning("click on file change");
    // e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    }
  };
  const handlePreviewPhoto = (e: React.MouseEvent) => {
    // e.preventDefault();
    toast.warning("click on preview photo");
    setShowPreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto flex w-full max-w-2xl flex-col">
      <ProfileHeader />
      <div className="w-full py-8">
        <AvatarPreviewModal
          imageUrl={user?.imageUrl || ""}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 text-indigo-600 hover:bg-white hover:text-indigo-700"
              >
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="group relative">
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="h-24 w-24 cursor-pointer rounded-full border-2 border-black"
                />
                {/*<Upload
                onClick={() => inputRef.current?.click()}
                className="absolute size-6"
              /> */}

                {/* <div className="absolute flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"> */}
                {/* <Upload className="h-6 w-6 text-white" /> */}
                <div className="absolute inset-0 -top-8 left-0 right-0 z-50 flex w-full items-center justify-around gap-2">
                  <Camera
                    className="h-7 w-7 cursor-pointer rounded-full bg-black/80 p-1 text-white opacity-70 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      toast.warning("click on change file");
                      inputRef.current?.click();
                    }}
                  />
                  <Eye
                    className="h-7 w-7 cursor-pointer rounded-full bg-black/80 p-1 text-white opacity-70 transition-opacity group-hover:opacity-100"
                    onClick={handlePreviewPhoto}
                  />
                </div>

                {isProfileUpdating && <LoadingCircle />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  ref={inputRef}
                />
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-row items-center gap-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Email:
                      </label>
                      {/* <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1"
                      type="email"
                    /> */}
                      <p className="text-gray-500">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                    <div className="flex md:flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name:
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 w-[70%]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isProfileUpdating}>
                        {isProfileUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex flex-row gap-1 md:flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name:
                      </label>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user?.fullName}
                      </h2>
                    </div>
                    <div className="flex flex-row gap-1 md:flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        Email:
                      </label>
                      <p className="text-gray-600">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700">
                Account Details
              </h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600">
                  Member since{" "}
                  {new Date(user?.createdAt || "").toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Last updated{" "}
                  {new Date(user?.updatedAt || "").toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  // <div className="container mx-auto max-w-2xl py-8">
  //   <div className="rounded-lg border p-6">
  //     <h1 className="mb-6 text-2xl font-bold">Profile Settings</h1>

  //     <div className="space-y-6">
  //       <div className="flex items-center gap-4">
  //         <div className="relative">
  //           <img
  //             src={user?.imageUrl}
  //             alt="Profile"
  //             className="h-24 w-24 cursor-pointer rounded-full"
  //             onClick={() => {
  //               inputRef.current?.click();
  //               // document.getElementById("avatar-upload")?.click();
  //             }}
  //           />

  //           {isUpdating && <LoadingCircle />}
  //         </div>

  //         <div>
  //           <h2 className="text-lg font-semibold">{user?.fullName}</h2>
  //           <p className="text-gray-600">
  //             {user?.primaryEmailAddress?.emailAddress}
  //           </p>
  //         </div>
  //       </div>

  //       <input
  //         type="file"
  //         accept="image/*"
  //         onChange={handleFileChange}
  //         className="hidden"
  //         ref={inputRef}
  //       />

  //       <div className="space-y-4">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Full Name
  //           </label>
  //           <p className="mt-1 text-gray-900">{user?.fullName}</p>
  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Email Address
  //           </label>
  //           <p className="mt-1 text-gray-900">
  //             {user?.primaryEmailAddress?.emailAddress}
  //           </p>
  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Account Created
  //           </label>
  //           <p className="mt-1 text-gray-900">
  //             {new Date(user?.createdAt || "").toLocaleDateString()}
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>;
  // );
}
