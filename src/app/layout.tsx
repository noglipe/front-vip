import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-br">
      <body className={` antialiased bg-background`}>{children}</body>
    </html>
  );
}
