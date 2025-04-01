"use client";
import { GlobalNavbar } from "@/components/HeaderGlobal";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// import { Authenticated } from "convex/react";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50/50">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:6rem_4rem]" />

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center space-y-10 text-center">
        {/* Hero content */}
        <header className="space-y-6">
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text pb-2 text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
            Hamza AI Assistant
          </h1>
          <p className="max-w-[600px] text-lg text-gray-600 md:text-xl/relaxed xl:text-2xl/relaxed">
            Meet your new AI chat companion that goes beyond conversation - it
            can actually get things done!
            <br />
            <span className="text-sm text-gray-400">
              {/*Powered by IBM&apos;s WxTools & your favourite LLM&apos;s.*/}
              Powered by Hamza Missaoui
              {/* and list of LLM&apos;s. */}
            </span>
          </p>
        </header>

        <GlobalNavbar />

        {/* CTA Button */}
        <SignedIn>
          <Link href="/dashboard">
            <button className="group relative flex items-center justify-center rounded-full bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-3.5 text-base font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={"/dashboard"}
            // forceRedirectUrl={"/dashboard"}
          >
            <button className="group relative flex items-center justify-center rounded-full bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-3.5 text-base font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl">
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
            </button>
          </SignInButton>
        </SignedOut>

        {/* Features grid */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 pt-8 md:grid-cols-3 md:gap-16">
          {[
            { title: "Fast", description: "Real-time streamed responses" },
            {
              title: "Modern",
              description: "Next.js 15, Tailwind CSS, Convex, Clerk",
            },
            { title: "Smart", description: "Powered by Your Favourite LLM's" },
          ].map(({ title, description }) => (
            <div key={title} className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {title}
              </div>
              <div className="mt-1 text-sm text-gray-600">{description}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
