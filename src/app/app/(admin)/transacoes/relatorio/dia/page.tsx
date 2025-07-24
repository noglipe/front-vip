"use client";

import { DatePickerForm } from "@/components/form/datePickerForm";
import { Loading } from "@/components/loading";
import { Button } from "@/components/UI/button";
import { Card, CardDescription } from "@/components/UI/card";
import { format } from "date-fns";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import TabelaTransacoes from "@/app/app/_components/tabelaTransacoes";
import { ApiNovo } from "@/lib/api";
import ResumoFinanceiro from "@/app/app/_components/ResumoFinanceiro";

export default function Page() {
  const [data, setData] = useState<any>();
  const [dados, setDados] = useState<TransacoesPropsApi>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleBuscar() {
    setLoading(true);

    if (data) {
      const dia = format(data, "yyyy-MM-dd");
      const response = await ApiNovo(`financeiro/transacao/dia/${dia}/`);
      const res = await response.json();
      setDados(res);
      setLoading(false);
    } else {
      alert("Favor Inserir uma Data");
    }
  }

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">Erro: {error}</p>;

  const diferenca = dados
    ? (dados?.total_receitas || 0) + (dados?.total_despesas || 0)
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
            <ResumoFinanceiro
              totalReceitas={dados.total_receitas}
              totalDespesas={dados.total_despesas}
            />
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
