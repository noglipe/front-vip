"use client";

import { SidebarTrigger, useSidebar } from "@/components/UI/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/UI/card";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <>
      <AppSidebar />
      <main
        className={`p-1 transition-all duration-300 w-full h-full flex flex-col ${
          open ? "ml-0 flex-1" : "w-full flex-1"
        }`}
      >
        <SidebarTrigger
          className={`cursor-pointer print:hidden md:block
      ${isMobile && "p-6 w-full bg-black mb-1"}`}
        />
        <Card className="flex-1 p-4 overflow-y-auto">{children}</Card>
      </main>
    </>
  );
}
