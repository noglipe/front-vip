"use client";

import { DatePickerForm } from "@/components/form/datePickerForm";
import { Loading } from "@/components/loading";
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import { format } from "date-fns";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import PainelValor from "../../_components/painelValor";
import TabelaTransacoes from "@/app/app/_components/tabelaTransacoes";
import { ApiNovo } from "@/lib/api";

export default function Page() {
  const [dataI, setDataI] = useState();
  const [dataF, setDataF] = useState();
  const [dados, setDados] = useState<TransacoesPropsApi>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleBuscar() {
    setLoading(true);

    if (dataI && dataF) {
      const response = await ApiNovo(
        `financeiro/transacao/entre-datas/?dataI=${format(
          dataI,
          "yyyy-MM-dd"
        )}&dataF=${format(dataF, "yyyy-MM-dd")}`
      );
      setDados(await response.json());
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
            <DatePickerForm
              setFunc={setDataI}
              date={dataI}
              descricao={"Data Inicial"}
            />

            <DatePickerForm
              setFunc={setDataF}
              date={dataF}
              descricao={"Data Final"}
            />
          </div>
          <Button onClick={handleBuscar}>Buscar</Button>
        </div>
      </Card>

      {dados ? (
        <div className="container mx-auto mt-2 space-y-6">
          {/* Totais Financeiros */}
          <Card className="container p-4  rounded-xl">
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
