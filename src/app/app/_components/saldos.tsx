"use client";

import { useEffect, useState } from "react";
import client from "../../../lib/apollo-client";
import { useQuery } from "@apollo/client";
import { APP_QUERY } from "@/graphql/query";
import { Loading } from "@/components/loading";
import { Separator } from "@/components/UI/separator";

import { PainelSaldos } from "./cardSaldos";

interface App {
  caixas: CardSaldosProps[];
  instituicoesFinanceiras: CardSaldosProps[];
}

export default function Saldos() {
  const [dados, setDados] = useState<App[] | any>(null);
  
  const { loading, error, data } = useQuery<{ app: App[] }>(APP_QUERY, {
    client,
  });

  useEffect(() => {
    if (data !== undefined) {
      setDados(data);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="p-4 bg-muted rounded-xl space-y-6">
      <PainelSaldos titulo="Caixas" objetos={dados?.caixas ?? []} />
      <Separator />
      <PainelSaldos
        titulo="Instituições Financeiras"
        objetos={dados?.instituicoesFinanceiras ?? []}
      />
    </div>
  );
}
