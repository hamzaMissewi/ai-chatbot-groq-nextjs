import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      <SignIn path="/sign-in" />
    </main>
  );
}
