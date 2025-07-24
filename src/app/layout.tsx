import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/UI/sonner";

export const metadata: Metadata = {
  title: "Familia Vida e Paz",
  description: "Aplicativo de Gestão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={` antialiased bg-background p-4`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
