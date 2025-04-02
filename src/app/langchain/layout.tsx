"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ResizablePanelGroup } from "@/components/ui/resizable";
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
      <div className="flex h-screen flex-col bg-gradient-to-br from-red-800 to-slate-800">
        <Header />

        <ResizablePanelGroup
          direction="horizontal"
          className="flex max-h-[calc(100vh-5rem)] flex-1 overflow-hidden"
        >
          <Authenticated>
            <Sidebar />
          </Authenticated>

          <NuqsAdapter>
            <main className="flex-1 overflow-scroll">{children}</main>
          </NuqsAdapter>
        </ResizablePanelGroup>
      </div>
    </NavigationProvider>
  );
}
