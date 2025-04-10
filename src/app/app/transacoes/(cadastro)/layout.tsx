"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { usePathname } from "next/navigation";
import TransacoesRecentes from "../_components/transacoesRecentes";
import { DESPESA_LIST_QUERY, RECEITA_LIST_QUERY } from "@/graphql/query";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  let isDespesa = false;
  let isReceita = false;

  if (pathname.includes("/despesa")) {
    isDespesa = true;
  } else if (pathname.includes("/receita")) {
    isReceita = true;
  }

  return (
    <div className="flex justify-center items-center p-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {children}
          <div >
            {isDespesa && (
              <TransacoesRecentes
                receita={false}
                query={DESPESA_LIST_QUERY}
                dataKey="despesas"
              />
            )}
            {isReceita && (
              <TransacoesRecentes
                dataKey="receitas"
                receita={true}
                query={RECEITA_LIST_QUERY}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
