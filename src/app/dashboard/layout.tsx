"use client";

import Sidebar from "@/components/Sidebar";
import { NavigationProvider } from "@/lib/navigation";
import { Authenticated } from "convex/react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <NavigationProvider>
      <div className="flex h-screen bg-gradient-to-br from-cyan-800 to-slate-800">
        <Authenticated>
          <Sidebar />
        </Authenticated>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  );
}
