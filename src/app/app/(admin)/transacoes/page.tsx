"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import PainelValor from "./_components/painelValor";
import TabelaTransacoes from "../../_components/tabelaTransacoes";
import { ApiNovo } from "@/lib/api";
import { Tickets } from "lucide-react";

export default function Page() {
  const [dados, setDados] = useState<TransacoesPropsApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>();

  useEffect(() => {
    setLoading(true);

    const getDados = async () => {
      const response = await ApiNovo(`financeiro/transacao/`, "GET");
      const dados = await response.json();
      setDados(dados);
      setLoading(false);
    };

    getDados();
  }, []);

  if (loading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-red-500">
        Erro: {error} - {error.message}
      </p>
    );

  const diferenca = dados
    ? (dados?.total_receitas || 0) + (dados?.total_despesas || 0)
    : 0;

  return (
    <>
      {dados ? (
        <div className="flex flex-col gap-4">
          {/* Totais Financeiros */}
          <Card className="p-4 rounded-sm w-full ">
            <CardHeader>
              <CardTitle className=" flex gap-2 items-center">
                <Tickets /> TRANSAÇÕES
              </CardTitle>
            </CardHeader>
            <CardContent className=" grid grid-cols-1 md:grid-cols-3 gap-2">
              <PainelValor
                valor={dados?.total_receitas || 0}
                title="Total de Receitas"
              />
              <PainelValor
                valor={dados?.total_despesas || 0}
                title="Total de Despesas"
              />
              <PainelValor valor={diferenca} title=" Diferença" />
            </CardContent>
            <CardFooter className="justify-end text-gray-400">
              *Dados referente ao mês vigente
            </CardFooter>
          </Card>

          {/* Tabela de Transações */}
          {dados && <TabelaTransacoes dados={dados.transacao} />}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
