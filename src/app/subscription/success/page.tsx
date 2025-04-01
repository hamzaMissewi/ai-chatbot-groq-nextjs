"use client";
import { redirect, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/cn";

function SuccessPage() {
  const urlParams = useSearchParams();
  const planType = urlParams?.get("plan_type");
  const sessionId = urlParams?.get("session_id");
  const { user, isLoaded } = useUser();

  // COMPLETED BUT TO SEE IF NEEDED
  // useEffect(() => {
  //   async function sendOrderConfirmationEmail() {
  //     if (!user) return;
  //     await fetch("/api/order-success-email", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         orderNumber,
  //         sessionId,
  //         email: user?.emailAddresses[0].emailAddress,
  //         username: user?.username,
  //       }),
  //     });
  //   }
  //   sendOrderConfirmationEmail();
  // });

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       redirect("/");
  //     }, 10000);
  //     return () => clearTimeout(timer);
  //   }, []);

  if (!isLoaded) {
    return (
      <div
        className={cn(
          "relative flex min-h-screen items-center justify-self-center",
        )}
      >
        {/*<Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />*/}
        <div
          className={`loading w-34 h-34 border-b-3 animate-spin rounded-full border-blue-500`}
        />
      </div>
    );
  }

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div
        className={"mx-4 w-full max-w-2xl rounded-xl bg-white p-12 shadow-lg"}
      >
        <div className={"mb-8 flex justify-center"}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className={"h-8 w-8 text-green-600"}
              fill={"none"}
              stroke={"currentColor"}
              viewBox={"0 0 24 24"}
            >
              <path
                strokeLinecap={"round"}
                strokeLinejoin={"round"}
                strokeWidth={2}
                d={"M5 13l4 4L19 7"}
              />
            </svg>
          </div>
        </div>

        <h1 className={"mb-6 text-center text-4xl font-bold"}>
          Thank You for your subcription!
        </h1>

        <div className={"mb-2 border-y border-gray-200 py-6"}>
          <p className={"mb-4 text-lg text-gray-700"}>
            Your subscription has been confirmed, Now you have all the features
            of <span className="text-green-700">{planType}</span> plan are
            unlocked
          </p>
          <div className={"space-y-2"}>
            {/* {planType && (
              <p
                className={
                  "flex items-center space-x-5 text-gray-700 dark:text-white"
                }
              >
                <span>Subscription Type:</span>
                <span className={"font-none text-sm text-green-600"}>
                  {planType}
                </span>
              </p>
            )} */}
            {sessionId && (
              //   <p className="flex w-full flex-col justify-between text-gray-700 dark:text-white">
              <p className="flex w-full flex-wrap items-center gap-2 text-gray-700 dark:text-white">
                <span className="text-nowrap">Transaction ID:</span>
                <span className="font-none text-left text-sm">{sessionId}</span>
              </p>
            )}
          </div>
        </div>

        <div className={"space-y-4 text-gray-700 dark:text-white"}>
          {/*<p className={"text-gray-700 dark:text-white"}>*/}
          <p>
            {/*A confirmation email has been sent to your registered email address*/}
            We send you an email about your subscription to{" "}
            {user?.emailAddresses?.[0].emailAddress}
          </p>
          {/* <div className={"flex flex-col justify-center gap-4 sm:flex-row"}> */}
          {/* <Button className={"bg-green-600 hover:bg-green-700"}>
              <Link href={"/"}>View Subscription Details</Link>
            </Button> */}
          {/* <Button asChild variant={"outline"}> */}
          <Button
            className={
              "mt-2 flex justify-self-center bg-green-600 hover:bg-green-700"
            }
          >
            <Link href={"/"}>Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
