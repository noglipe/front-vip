import { SidebarProvider, SidebarTrigger } from "@/components/UI/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
        </body>
    </html>
  );
}
