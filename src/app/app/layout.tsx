import { SidebarProvider } from "@/components/UI/sidebar";
import { ClientLayout } from "./_components/ClientLayout";
import VerificarLogin from "@/components/verificarLogin";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <VerificarLogin />
      <SidebarProvider>
        <ClientLayout>{children}</ClientLayout>
      </SidebarProvider>
    </div>
  );
}
