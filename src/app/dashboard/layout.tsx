"use client";

import Sidebar from "@/components/Sidebar";
import { NavigationProvider } from "@/lib/navigation";
import { Authenticated } from "convex/react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const { isMobileNavOpen, closeMobileNav } = useNavigation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <NavigationProvider>
      {/* <div className="overflo-hidden flex h-screen flex-col bg-gradient-to-br from-cyan-800 to-slate-800"> */}

      <div className="flex h-screen flex-col bg-gradient-to-br from-gray-100 to-gray-50">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/*<ResizablePanelGroup
          direction="horizontal"
          className="flex max-h-[calc(100vh-5rem)] flex-1 overflow-hidden"
        >
          <Authenticated>
            <Sidebar />
          </Authenticated>
          <ResizableHandle className="bg-[#00ff99]" withHandle />
          <ResizablePanel
            defaultSize={isSidebarOpen ? 70 : 100}
            minSize={50}
            className="flex flex-1"
          >
            {children}
          </ResizablePanel>
        </ResizablePanelGroup> */}

        {/* <ResizablePanelGroup direction="horizontal" className="h-full w-full"> */}
        <div className="flex-1 overflow-hidden pt-16">
          <div className="h-full overflow-x-auto">
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full min-w-[800px]"
            >
              <ResizablePanel
                defaultSize={isSidebarOpen ? 30 : 0}
                minSize={isSidebarOpen ? 14 : 0}
                collapsible={!isSidebarOpen}
                maxSize={33}
                collapsedSize={0}
                className="overflow-hidden"
              >
                <Authenticated>
                  <Sidebar />
                </Authenticated>
              </ResizablePanel>
              <ResizableHandle className="bg-[#00ff99]" withHandle />
              <ResizablePanel
                defaultSize={isSidebarOpen ? 70 : 100}
                minSize={50}
                className="overflow-hidden"
              >
                {children}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </NavigationProvider>
  );
}
