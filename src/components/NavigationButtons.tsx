"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import { cn } from "@/lib/cn";

export const NavigationButtons = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  // const [history, setHistory] = useState<string[]>([])
  // const canGoBack = currentIndex > 0
  // const canGoForward = currentIndex < history.length - 1

  useEffect(() => {
    const updateHistory = () => {
      // setHistory(prev => [
      //   ...prev.slice(0, currentIndex + 1),
      //   window.location.pathname
      // ])
      setCurrentIndex((prev) => prev + 1);
    };

    window.addEventListener("popstate", updateHistory);
    return () => window.removeEventListener("popstate", updateHistory);
  }, [currentIndex]);

  const handleNavigation = (sens: "prev" | "next") => {
    setIsNavigating(true);
    try {
      if (sens === "prev") {
        if (window.history.length > 1) {
          router.back();
          setCurrentIndex((prev) => prev - 1);
        } else {
          router.push("/");
        }
      } else if (sens === "next") {
        // For forward navigation
        // window.history.forward()
        router.forward();
        setCurrentIndex((prev) => prev + 1);
        // Optional: Force refresh if needed
        setTimeout(() => router.refresh(), 100);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      router.push("/404");
    } finally {
      setIsNavigating(false);
    }
  };

  // prefetch (optional)
  // useEffect(() => {
  //   if (canGoForward) {
  //     router.prefetch(history[currentIndex + 1])
  //   }
  // }, [canGoForward, currentIndex, history])

  if (isNavigating) return <LoadingSpinner spinner={true} />;

  return (
    <div
      className={cn(
        "flex items-center focus:outline-none dark:text-[#00ff99]",
        className || "fixed z-50 my-4 ml-5 gap-2",
      )}
    >
      {/* <div className={"group relative"}> */}
      <button
        onClick={() => handleNavigation("prev")}
        // disabled={isNavigating || !canGoBack}
        disabled={isNavigating}
        className="rounded-full border bg-[#4A154B] text-white hover:bg-[#00ff99] hover:text-[#4A154B] dark:bg-transparent dark:hover:text-[#00ff99]"
      >
        <MdNavigateBefore className="text-xl lg:text-2xl" />
      </button>
      {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" /> */}
      <button
        onClick={() => handleNavigation("next")}
        disabled={isNavigating}
        className="rounded-full border bg-[#4A154B] text-white hover:bg-[#00ff99] hover:text-[#4A154B] dark:bg-transparent dark:hover:text-[#00ff99]"
      >
        <MdNavigateNext className="text-xl lg:text-2xl" />
      </button>

      {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" /> */}
    </div>
  );
};

{
  /* export const NavigationButtonsOld = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const updateHistory = () => {
      setHistory((prev) => [
        ...prev.slice(0, currentIndex + 1),
        window.location.pathname,
      ]);
      setCurrentIndex((prev) => prev + 1);
    };

    window.addEventListener("popstate", updateHistory);
    return () => window.removeEventListener("popstate", updateHistory);
  }, [currentIndex]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const handleNavigation = (sens: "prev" | "next") => {
    setIsNavigating(true);
    try {
      if (sens === "prev") {
        if (window.history.length > 1) {
          router.back();
          setCurrentIndex((prev) => prev - 1);
        } else {
          router.push("/");
        }
      } else if (sens === "next") {
        // For forward navigation
        // if (typeof window !== 'undefined') {
        // window.history.forward()
        router.forward();
        setCurrentIndex((prev) => prev + 1);
        // Optional: Force refresh if needed
        setTimeout(() => router.refresh(), 100);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      router.push("/404");
    } finally {
      setIsNavigating(false);
    }
  };

  // prefetch (optional)
  useEffect(() => {
    if (canGoForward) {
      router.prefetch(history[currentIndex + 1]);
    }
  }, [canGoForward, currentIndex, history]);

  if (isNavigating) return <LoadingSpinner spinner={true} />;
  return (
    <div className={"mx-2 flex items-center gap-4"}>
      {canGoBack && (
        <Button
          variant={"ghost"}
          onClick={() => handleNavigation("prev")}
          disabled={isNavigating}
          // disabled={isNavigating || !canGoBack}
          className="dark:text-[#00ff99] flex items-center gap-2 rounded-lg p-1 text-[#00ff99] text-black disabled:text-muted-foreground disabled:opacity-70 dark:border dark:bg-transparent"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </Button>
      )}
      {canGoForward && (
        <Button
          variant={"ghost"}
          onClick={() => handleNavigation("next")}
          disabled={isNavigating}
          // disabled={isNavigating || !canGoForward}
          className="dark:text-[#00ff99] flex items-center gap-2 rounded-lg bg-[#00ff99] p-1 text-black disabled:text-muted-foreground disabled:opacity-70 dark:border dark:bg-transparent"
          aria-label="Go back to previous page"
        >
          <ArrowRightIcon className="h-5 w-5" />
          <span>Next</span>
        </Button>
      )}
    </div>
  );
}; */
}
