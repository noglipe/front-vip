"use client";

import { Card, CardContent } from "@/components/UI/card";
import { formatReal } from "@/lib/utils";
import { useEffect, useState } from "react";
import client from "../../../lib/apollo-client";
import { useQuery } from "@apollo/client";
import { APP_QUERY } from "@/graphql/query";
import { Loading } from "@/components/loading";
import { Separator } from "@/components/UI/separator";

interface App {
  caixas: {
    nome: string;
    id: string;
    saldo: number;
  }[];
  instituicoesFinanceiras: {
    id: string;
    nome: string;
    saldo: number;
  }[];
}

interface Cx {
  nome: string;
  id: string;
  saldo: number;
}

interface iF {
  id: string;
  nome: string;
  saldo: number;
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
    <div className="flex flex-col gap-4 bg-gray-50 rounded-xl p-4">
      <h2 className="text-2xl uppercase font-extrabold">Caixas</h2>
      
      <div className="flex flex-row gap-3 flex-wrap">
        {dados &&
          dados?.caixas.map((caixa: Cx) => (
            <Card key={caixa.id} className="p-4 hover:bg-gray-200 cursor-default">
              <CardContent>
                <h2 className="text-lg font-bold">{caixa.nome}</h2>
                {caixa.saldo > 0 ? (
                  <p className="text-2xl font-semibold">
                    {formatReal(caixa.saldo)}
                  </p>
                ) : (
                  <p className="text-2xl font-semibold text-red-500 ">
                    {formatReal(caixa.saldo)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      <Separator />

      <h2 className="text-2xl uppercase font-extrabold">Bancos</h2>
      <div className="flex flex-row gap-3 flex-wrap">
        {dados &&
          dados?.instituicoesFinanceiras.map((inst: iF) => (
            <Card key={inst.id} className="p-4 hover:bg-gray-200 cursor-default">
              <CardContent>
                <h2 className="text-lg font-bold">{inst.nome}</h2>
                <p className="text-2xl font-semibold">
                  {formatReal(inst.saldo)}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
