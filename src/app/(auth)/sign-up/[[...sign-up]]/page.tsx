"use client";
import { useCreateUser } from "@/components/convex/useCreateUser";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  // const { createUser, isCreating } = useCreateUser();

  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      {/* {isCreating && <Loader} */}
      <SignUp path="/sign-up" />
    </main>
  );
}
