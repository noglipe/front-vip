"use client";

import { DatePickerForm } from "@/components/form/datePickerForm";
import { Loading } from "@/components/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/alert";
import { Button } from "@/components/UI/button";
import { Card, CardDescription } from "@/components/UI/card";
import { url } from "@/lib/apollo-client";
import { format } from "date-fns";
import { AlertCircle, FilterIcon, Terminal } from "lucide-react";
import { useState } from "react";
import PainelValor from "../../_components/painelValor";
import TabelaTransacoes from "@/app/app/_components/tabelaTransacoes";

export default function Page() {
  const [data, setData] = useState();
  const [dados, setDados] = useState<TransacoesPropsApi>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleBuscar() {
    setLoading(true);

    if (data) {
      const dia = format(data, "yyyy-MM-dd");
      fetch(`${url}financeiro/transacao/dia/${dia}/`)
        .then((res) => {
          return res.json();
        })
        .then((data: TransacoesPropsApi) => {
          setDados(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error ao buscar transacoes:", err);
          setError(err);
          setLoading(false);
        });
      console.log(data);
    } else {
      alert("Favor Inserir uma Data");
    }
  }

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">Erro: {error}</p>;

  const diferenca = dados
    ? (dados?.total_receitas || 0) - (dados?.total_despesas || 0)
    : 0;

  return (
    <div>
      <Card className="p-4">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            <FilterIcon className="h-4 w-4" />
            <DatePickerForm setFunc={setData} date={data} />
          </div>
          <Button onClick={handleBuscar}>Buscar</Button>
        </div>
      </Card>
      

      {dados ? (
        <div className="container mx-auto mt-2 space-y-6">
          {/* Totais Financeiros */}
          <Card className="container p-4  rounded-xl">
           <h2>Transações do dia {data ? format(data, "dd/MM/yyyy") : ""}</h2>
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
    </div>
  );
}
