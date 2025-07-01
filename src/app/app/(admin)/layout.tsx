import { SidebarProvider } from "@/components/UI/sidebar";
import VerificarLogin from "@/components/verificarLogin";
import { ClientLayout } from "../_components/ClientLayout";
import VerificarAdmin from "./_componentes/verificarAdmin";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <VerificarAdmin />
      <SidebarProvider>
        <ClientLayout>{children}</ClientLayout>
      </SidebarProvider>
    </div>
  );
}
