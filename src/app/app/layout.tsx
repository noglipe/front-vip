import { SidebarProvider } from "@/components/UI/sidebar";
import { ClientLayout } from "./_components/ClientLayout";
import VerificarLogin from "@/components/verificarLogin";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="w-full">
        <VerificarLogin />
        <SidebarProvider>
          <ClientLayout>{children}</ClientLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}
