"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { NavigationProvider } from "@/lib/navigation";
import { Authenticated } from "convex/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <div className="flex h-screen bg-gradient-to-br from-red-800 to-slate-800">
        <Authenticated>
          <Sidebar />
        </Authenticated>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <NuqsAdapter>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </NuqsAdapter>
        </div>
      </div>
    </NavigationProvider>
  );
}
