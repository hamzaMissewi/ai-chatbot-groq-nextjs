"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { NavigationProvider } from "@/lib/navigation";
import { Authenticated } from "convex/react";

export default function DashboardLayout({
                                          children
                                        }: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <div className="flex bg-gradient-to-br from-cyan-800 to-slate-800 h-screen">
        <Authenticated>
          <Sidebar />
        </Authenticated>

        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  );
}
