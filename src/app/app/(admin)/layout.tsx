import VerificarAdmin from "./_componentes/verificarAdmin";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <VerificarAdmin />
      {children}
    </div>
  );
}
