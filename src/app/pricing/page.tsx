"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { TbBrandOpenai } from "react-icons/tb";
import type { SubscriptionLevel } from "@/lib/types";
import { NavigationButtons } from "@/components/NavigationButtons";
// import { SiLangchain } from "react-icons/si";
// import { ArrowLeft } from "lucide-react";

// import { useRouter } from "next/navigation";

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );

const plans: {
  name: "Basic" | "Pro" | "Pro+";
  value: SubscriptionLevel;
  price: string;
  description: string;
  features: string[];
  priceId: string;
}[] = [
  {
    name: "Basic",
    price: "Free",
    value: "free",
    // description: "For personal and side projects",
    description: "For normal usage of public LLMs, no advanced features",
    features: [
      "Access to basic AI models",
      "5 chats per day",
      "Basic support",
      "Standard response time",
    ],
    priceId: "free_plan", // Free plan doesn't need a price ID
  },
  {
    name: "Pro",
    price: "$15",
    value: "pro",
    description: "For professionals and small teams",
    features: [
      "Everything in Basic",
      "Access to advanced AI models",
      "Unlimited chats",
      "Priority support",
      "Faster response time",
      "Custom AI configurations",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!, //"price_xxxxx", // Add your Stripe price ID here
  },
  {
    name: "Pro+",
    value: "pro_plus",
    price: "$29",
    description: "For businesses and large teams",
    features: [
      "Everything in Pro",
      "Access to all AI models",
      "Team collaboration features",
      "24/7 premium support",
      "API access",
      "Custom integrations",
      "Advanced analytics",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY!, //"price_yyyy",
  },
];

export default function PricingPage() {
  const { isSignedIn, userId } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const subscriptionLevel = useSubscriptionStatus();
  const currentSubscriptions = [subscriptionLevel, "free_plan", "plan"];

  const handleSubscription = async (priceId: string, planName: string) => {
    try {
      setLoading(planName);

      if (!isSignedIn) {
        toast.error("Please sign in to subscribe");
        return;
      }

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId,
          planName,
        }),
      });

      const { sessionUrl } = await response.json();
      // console.log("redirectUrl >>>", redirectUrl);

      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
      // const stripe = await stripePromise;
      // if (!stripe) {
      //   throw new Error("Stripe failed to load");
      // }
      // const result = await stripe.redirectToCheckout({
      //   sessionId,
      // });
      // if (result?.error) {
      //   toast.error(result.error.message);
      // }
    } catch (error) {
      console.error(
        `Error creating checkout session, error: ${JSON.stringify(error)}`,
        error,
      );
      toast.error(
        `Something went wrong. Please try again. Error: ${JSON.stringify(error)}`,
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="flex flex-col space-y-4 bg-gray-200">
      <PricingHeader />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-lg font-semibold leading-7 tracking-widest text-indigo-600">
                Pricing
              </h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Choose the right plan for you
              </p>
              {/* <Button
                  onClick={() => router.push("/dashboard")}
                  variant={"outline"}
                  className="group relative mt-8 inline-flex items-center rounded-lg"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:translate-x-0.5" />
                  Go Back
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                </Button> */}
            </div>
            <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${plan.name === "Pro" ? "lg:z-10 lg:rounded-b-none" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3 className="text-lg font-semibold leading-8 text-gray-900">
                        {plan.name}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {plan.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        {plan.price}
                      </span>
                      {plan.price !== "Free" && (
                        <span className="text-sm font-semibold leading-6 text-gray-600">
                          /month
                        </span>
                      )}
                    </p>
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                    >
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <Check className="h-6 w-5 flex-none text-indigo-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.value === "free" && (
                    <Button
                      className={`mt-8 bg-indigo-600 hover:bg-indigo-500`}
                      onClick={() =>
                        handleSubscription(plan.priceId, plan.name)
                      }
                      disabled={true}
                    >
                      Free Plan
                    </Button>
                  )}

                  <Button
                    className={`mt-8 ${
                      plan.value === subscriptionLevel
                        ? ""
                        : plan.name === "Pro"
                          ? "bg-indigo-600 hover:bg-indigo-500"
                          : plan.name === "Pro+"
                            ? "bg-red-700 text-white hover:bg-red-600"
                            : ""
                      // "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    }`}
                    onClick={() => handleSubscription(plan.priceId, plan.name)}
                    disabled={
                      loading === plan.name ||
                      (currentSubscriptions.includes(plan.value) && isSignedIn)
                    }
                  >
                    {loading === plan.name
                      ? "Loading..."
                      : // : plan.value === "free" &&
                        //     plan.value === subscriptionLevel
                        //   ? "Current plan"
                        plan.value === subscriptionLevel
                        ? // : currentSubscriptions.includes(plan.value)
                          "Current plan"
                        : plan.value !== "free"
                          ? "Get Started"
                          : ""}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PricingHeader() {
  const router = useRouter();
  const { user } = useUser();
  // const [userLevel, setUserLevel] = useState<SubscriptionLevel>("free");
  // const { ConfirmDialog: ConfirmGoBack, confirm } = useConfirmDialog({
  //   title: "Are you sure you want to go back ?",
  // });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-1 items-center gap-5">
          <div
            // shadow-md hover:shadow-gray-800
            className="mr-4 flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-xl hover:border-white/20 md:mr-6"
            onClick={() => router.push("/dashboard")}
          >
            <TbBrandOpenai className={"size-6"} />
            {/*hover:bg-gradient-to-r hover:scale-105 from-red-700 to-red-600 hover:bg-clip-text hover:text-transparent*/}
            {/*<p className="electric-hover hover:electric-effect max-w-[40%] animate-pulse truncate rounded-lg p-1 px-2 text-lg font-semibold tracking-wide transition-all duration-1000 ease-in-out hover:animate-none hover:text-red-700 md:text-xl">*/}
            <p className="truncate rounded-lg p-1 px-2 text-lg font-semibold tracking-wide transition-all duration-1000 ease-in-out hover:animate-none hover:animate-pulse hover:text-red-700 md:text-xl">
              Hamza AI Assistant
            </p>
            {/* <SiLangchain className={"size-8"} /> */}

            {/* Shining animation layer */}
            {/*<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out hover:animate-shine" />*/}
          </div>

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

        <div className="flex items-center justify-end space-x-3">
          <NavigationButtons className={"hidden items-center gap-1 md:flex"} />
          {user?.fullName && (
            <div className="hidden flex-col text-center md:flex">
              <p className="text-xs">welcome back:</p>
              <span className="text-sm text-gray-500">{user.fullName}</span>
            </div>
          )}

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
        </div>
      </div>
    </header>
  );
}
