"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useNavigation } from "@/lib/navigation";
import { Camera, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { TbBrandOpenai } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useConfirmDialog } from "@/components/hooks/useConfirmDialog";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { NavigationButtons } from "./NavigationButtons";
import { cn } from "@/lib/cn";
import { useState } from "react";
// import type { SubscriptionLevel } from "@/lib/types";
// import { useEffect, useState } from "react";
// import { getUserSubscriptionLevel } from "@/lib/getSubscriptionLevel";
// import { SiLangchain } from "react-icons/si";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user } = useUser();
  const [hideHeader, setHideHeader] = useState(false);
  const { isMobileNavOpen, setIsMobileNavOpen } = useNavigation();
  const { ConfirmDialog, confirm: confirmExitApp } = useConfirmDialog({
    title: "Exit App",
    description: "You're about to exit the app to see my portfolio, continue ?",
  });
  const userLevel = useSubscriptionStatus();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      user?.setProfileImage({ file });
    }
  };

  return (
    // <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[#00ff99] bg-white px-2 backdrop-blur-xl"></header>
    <header className="fixed top-0 z-50 flex min-h-5 w-full items-center justify-between border-b border-[#00ff99] bg-white px-4 backdrop-blur-xl">
      <ConfirmDialog />

      <div className={"flex w-full items-center justify-between"}>
        <div
          className={cn(
            "flex w-full items-center justify-between",
            hideHeader ? "h-fit opacity-0" : "",
          )}
        >
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsMobileNavOpen(!isMobileNavOpen);
                  onMenuClick?.();
                }}
                className="z-10 text-black hover:bg-accent hover:text-accent-foreground md:hidden"
              >
                <HamburgerMenuIcon className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="z-100 hidden cursor-pointer p-2 text-lg text-black hover:bg-accent hover:text-accent-foreground md:block"
                onClick={() => {
                  setIsMobileNavOpen(!isMobileNavOpen);
                  onMenuClick?.();
                }}
              >
                {isMobileNavOpen ? <ChevronLeft /> : <ChevronRight />}
              </Button>
            </SignedIn>

            <div
              onClick={() => router.push("/dashboard")}
              onDoubleClick={async () => {
                const ok = await confirmExitApp();
                if (!ok) return;
                window.open("https://hamza-portfolio-pro-2025.vercel.app", "");
              }}
              className="flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-xl text-black transition-all duration-500 ease-in-out hover:animate-none hover:animate-pulse hover:border-white/20 hover:text-red-700"
            >
              <TbBrandOpenai className={"size-6"} />
              {/*text-black hover:bg-gradient-to-r 
            hover:scale-105 from-red-700 to-red-600 
            hover:bg-clip-text hover:text-transparent*/}
              {/*<p className="electric-hover 
            hover:electric-effect max-w-[40%] 
            animate-pulse truncate rounded-lg p-1 px-2 
            text-lg font-semibold tracking-wide 
            transition-all duration-1000 ease-in-out 
            hover:animate-none hover:text-red-700 
            md:text-xl">*/}
              <p className="truncate rounded-lg p-1 px-2 text-lg font-semibold tracking-wide md:text-xl">
                Hamza AI Assistant
              </p>
              {/* <SiLangchain className={"size-8"} /> */}
              {/* Shining animation layer */}
              {/*<div className="absolute inset-0 
            overflow-hidden">*/}
              {/*    className="absolute inset-0 
            bg-gradient-to-r from-transparent via-white/
            30 to-transparent opacity-0 hover:opacity-100 
            transition-opacity duration-500 ease-in-out 
            hover:animate-shine" />*/}
              {/*</div>*/}
            </div>
          </div>

          {/* Middle Section - Navigation */}
          {/* <div className="hidden flex-1 items-center justify-center lg:flex">
          <NavigationButtons className="items-center gap-1 focus:outline-none" />
        </div> */}

          {/* Right Section - User Info and Actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {user?.fullName && (
              <div className="hidden flex-col text-center md:flex">
                <p className="text-xs text-gray-700">welcome back</p>
                <span className="text-sm text-blue-900">{user.fullName}</span>
              </div>
            )}

            {/* <NavigationButtons className="items-center gap-2 focus:outline-none" /> */}
            {/* 
            <div className="hidden items-center gap-4 lg:flex">
              {userLevel !== "free" && (
                <p className="text-sm text-gray-600">
                  Your current plan:
                  <span className="font-medium text-indigo-600">
                    {userLevel === "pro_plus" ? "Pro+" : "Pro"}
                  </span>
                </p>
              )}

              {userLevel !== "pro_plus" && (
                <Button
                  size={"sm"}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => router.push("/pricing")}
                >
                  {userLevel === "free"
                    ? "Upgrade to Pro | Pro+"
                    : "Upgrade to Pro+"}
                </Button>
              )}
            </div> */}

            <div className="group relative">
              <UserButton
                userProfileMode="navigation"
                userProfileUrl="/dashboard/user-profile"
                appearance={{
                  elements: {
                    avatarBox:
                      "h-12 w-12 ring-2 ring-gray-200/50 ring-offset-2 rounded-full transition-shadow hover:ring-gray-300/50",
                    userButtonPopoverCard:
                      "bg-white shadow-lg border border-gray-200",
                    userButtonPopoverActions: "bg-gray-50",
                    userButtonPopoverActionButton: "hover:bg-gray-100",
                    userButtonPopoverFooter: "border-t border-gray-200",
                  },
                }}
              />
              <div
                className="absolute -right-2 -top-2 z-10 hidden cursor-pointer transition-opacity group-hover:block group-hover:opacity-100"
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
              />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHideHeader(!hideHeader)}
          className="text-black hover:bg-accent hover:text-accent-foreground"
        >
          {!hideHeader ? (
            <X className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
