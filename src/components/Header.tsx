"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useNavigation } from "@/lib/navigation";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { TbBrandOpenai } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useConfirmDialog } from "@/components/hooks/useConfirmDialog";
import { ArrowLeft } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { NavigationButtons } from "./NavigationButtons";
// import type { SubscriptionLevel } from "@/lib/types";
// import { useEffect, useState } from "react";
// import { getUserSubscriptionLevel } from "@/lib/getSubscriptionLevel";
// import { SiLangchain } from "react-icons/si";

export default function Header() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const { isMobileNavOpen, setIsMobileNavOpen } = useNavigation();
  const { ConfirmDialog, confirm: confirmExitApp } = useConfirmDialog({
    title: "Exit App",
    description: "You're about to exit the app to see my portfolio, continue ?",
  });
  const userLevel = useSubscriptionStatus();

  // const [userLevel, setUserLevel] = useState<SubscriptionLevel | undefined>(
  //   undefined,
  // );
  // useEffect(() => {
  //   async function checkUserSubs() {
  //     if (!isLoaded || !isSignedIn) return;
  //     const subs = await getUserSubscriptionLevel(user.id);
  //     setUserLevel(subs);
  //   }
  //   checkUserSubs();
  // }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      user?.setProfileImage({ file });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
      <ConfirmDialog />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-1 items-center gap-5">
          {/*MOBILE NAV*/}
          <SignedIn>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="text-gray-500 hover:bg-gray-100/50 hover:text-gray-700 md:hidden"
            >
              <HamburgerMenuIcon className="h-6 w-6" />
            </Button>
          </SignedIn>
          {/*DESKTOP*/}
          <SignedIn>
            <Button
              className="hidden cursor-pointer to-blue-600 bg-clip-text p-2 text-lg text-blue-800 text-transparent shadow-md hover:shadow-gray-800 md:block"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              {isMobileNavOpen ? (
                <ChevronLeft color={"black"} />
              ) : (
                <ChevronRight color={"black"} />
              )}
            </Button>
          </SignedIn>

          <div
            onClick={() => router.push("/dashboard")}
            onDoubleClick={async () => {
              const ok = await confirmExitApp();
              if (!ok) return;
              window.open("https://hamza-portfolio-pro-2025.vercel.app", "");
            }}
            // shadow-md hover:shadow-gray-800
            className="flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-xl hover:border-white/20 md:ml-4"
          >
            <TbBrandOpenai className={"size-6"} />
            {/*text-black hover:bg-gradient-to-r hover:scale-105 from-red-700 to-red-600 hover:bg-clip-text hover:text-transparent*/}
            {/*<p className="electric-hover hover:electric-effect max-w-[40%] animate-pulse truncate rounded-lg p-1 px-2 text-lg font-semibold tracking-wide transition-all duration-1000 ease-in-out hover:animate-none hover:text-red-700 md:text-xl">*/}
            <p className="truncate rounded-lg p-1 px-2 text-lg font-semibold tracking-wide transition-all duration-1000 ease-in-out hover:animate-none hover:animate-pulse hover:text-red-700 md:text-xl">
              Hamza AI Assistant
            </p>
            {/* <SiLangchain className={"size-8"} /> */}

            {/* Shining animation layer */}
            {/*<div className="absolute inset-0 overflow-hidden">*/}
            {/*    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out hover:animate-shine" />*/}
            {/*</div>*/}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-6">
          {/* Show current plan status if subscribed */}
          <NavigationButtons
            className={"hidden items-center gap-1 focus:outline-none md:flex"}
          />

          <div className="hidden items-center gap-3 md:flex">
            {userLevel !== "free" && (
              <p className="text-sm text-gray-600">
                Your current plan:
                <span className="ml-1 font-medium text-indigo-600">
                  {userLevel === "pro_plus" ? "Pro+" : "Pro"}
                </span>
              </p>
            )}

            {userLevel !== "pro_plus" && (
              <Button
                size={"sm"}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-2 text-white hover:from-indigo-500 hover:to-indigo-400"
                onClick={() => router.push("/pricing")}
              >
                {userLevel === "free"
                  ? "Upgrade to Pro | Pro+"
                  : "Upgrade to Pro+"}
              </Button>
            )}

            {/* <Button
            onClick={() => router.push("/dashboard")}
            variant={"outline"}
            className="group relative flex items-center rounded-lg px-1 py-0"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:translate-x-0.5" />
            Go Back
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
          </Button> */}
          </div>

          {user?.fullName && (
            <div className="hidden flex-col text-center md:flex">
              <p className="text-xs text-gray-700">welcome back</p>
              <span className="text-sm text-blue-900">{user.fullName}</span>
              {/* {user?.primaryEmailAddress?.emailAddress} */}
            </div>
          )}

          {/* <Button
              variant="outline"
              onClick={() => {
                //   if (inputRef.current) inputRef.current!.onclick(e);
                document.getElementById("avatar-upload")?.click();
              }}
              disabled={isUpdating}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUpdating ? "Uploading..." : "Upload New Picture"}
            </Button> */}
          <div className="group relative">
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/dashboard/user-profile"
              appearance={{
                elements: {
                  avatarBox:
                    "h-14 w-14 ring-2 ring-gray-200/50 ring-offset-2 rounded-full transition-shadow hover:ring-gray-300/50",
                  userButtonPopoverCard:
                    "bg-white shadow-lg border border-gray-200",
                  userButtonPopoverActions: "bg-gray-50",
                  userButtonPopoverActionButton: "hover:bg-gray-100",
                  userButtonPopoverFooter: "border-t border-gray-200",
                },
              }}
            />
            {/* <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 top-0 right-0 transition-opacity group-hover:opacity-100"  */}
            <div
              className="absolute -right-2 -top-2 z-10 hidden cursor-pointer transition-opacity group-hover:block group-hover:opacity-100"
              // onClick={() => inputRef.current?.click()}
              onClick={() => document.getElementById("input-data")?.click()}
            >
              <Camera className="h-7 w-7 rounded-full bg-white/40 p-1 text-black" />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 hidden cursor-pointer opacity-0"
              id="input-data"
              // ref={inputRef}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
