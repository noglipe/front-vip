"use client";

import { SidebarTrigger, useSidebar } from "@/components/UI/sidebar";
import { AppSidebar } from "./app-sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <>
      <AppSidebar />
      <main
        className={`p-4 transition-all duration-300 w-full ${
          open ? "ml-0 flex-1" : "w-full flex-1 "
        }`}
      >
        <SidebarTrigger className="cursor-pointer print:hidden md:block" />
        {children}
      </main>
    </>
  );
}
