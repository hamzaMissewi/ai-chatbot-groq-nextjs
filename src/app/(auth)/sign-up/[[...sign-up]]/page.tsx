"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  // const { createUser, isCreating } = useCreateUser();

  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      <div className="flex flex-col items-center gap-4">
        <SignUp path="/sign-up" />

        <Link
          href="/"
          // className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          className="flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Link>
      </div>
    </main>
  );
}
