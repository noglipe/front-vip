import { SidebarProvider } from "@/components/UI/sidebar";
import { ClientLayout } from "./_components/ClientLayout";
import VerificarLogin from "@/components/verificarLogin";
import { Toaster } from "@/components/UI/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <VerificarLogin />
      <SidebarProvider>
        <ClientLayout>{children}</ClientLayout>
        <Toaster position="top-center" richColors/>
      </SidebarProvider>
    </div>
  );
}
