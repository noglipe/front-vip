import { SidebarProvider, SidebarTrigger } from "@/components/UI/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="container w-full">
            <SidebarTrigger className="p-4 cursor-pointer" />
            <div className="container">
              <PrimeReactProvider>{children}</PrimeReactProvider>
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
