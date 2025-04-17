"use client";

import { Card, CardDescription } from "@/components/UI/card";
import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import PainelValor from "./_components/painelValor";
import TabelaTransacoes from "../_components/tabelaTransacoes";
import { url } from "@/lib/apollo-client";

export default function Page() {
  const [dados, setDados] = useState<TransacoesPropsApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>();

  useEffect(() => {
    setLoading(true);

    fetch(`${url}financeiro/transacao/`)
      .then((res) => {
        return res.json();
      })
      .then((data: TransacoesPropsApi) => {
        setDados(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar transações:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-red-500">
        Erro: {error} - {error.message}
      </p>
    );

  const diferenca = dados
    ? (dados?.total_receitas || 0) - (dados?.total_despesas || 0)
    : 0;

  return (
    <>
      {dados ? (
        <div className="container mx-auto p-6 space-y-6">
          {/* Totais Financeiros */}
          <Card className="container p-4 rounded-xl">
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
              <PainelValor
                valor={dados?.total_receitas || 0}
                title="Total de Receitas"
              />
              <PainelValor
                valor={dados?.total_despesas || 0}
                title="Total de Despesas"
              />
              <PainelValor
                valor={diferenca}
                title=" Diferença (Lucro / Prejuízo)"
              />
            </div>
            <CardDescription className="text-end font-bold">
              *Dados referente ao mês vigente
            </CardDescription>
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
