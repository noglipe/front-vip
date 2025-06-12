"use client";

import { useEffect, useState } from "react";
import DialogAno from "./_components/DialogAno";
import SelectMes from "./_components/SelectMes";
import { Loading } from "@/components/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { formatReal } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import GraficoCaixas from "./_components/graficosCaixas";
import GraficoMeses from "./_components/graficoMeses";

type Custos = {
  nome: string;
  total: {
    totalReceita: number;
    totalDespesa: number;
  };
};

type Caixas = {
  nome: string;
  saldoTotal: number;
  total: {
    totalReceita: number;
    totalDespesa: number;
    total: number;
  };
};

type Mes = {
  mes: string;
  totalReceita: number;
  totalDespesa: number;
};

type Ano = {
  saltoTotal: number;
  totalReceita: number;
  totalDespesa: number;
  mes: Mes[];
};

interface DadosRelatorio {
  totalReceita: number;
  totalDespesa: number;
  total: number;
  custosPorCentro: Custos[];
  custosPorCaixas: Caixas[];
  ano?: Ano;
}

export default function Page() {
  const [ano, setAno] = useState<number | null>(2025);
  const [mes, setMes] = useState<string | null | undefined>(null);
  const [selctAtivo, SetSelectAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<DadosRelatorio | null>(null);

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    if (typeof ano === "number") {
      SetSelectAtivo(false);
      consultaAno();
    }
  }, [ano, mes]);

  async function consultaAno() {
    setLoading(true);
    try {
      let url = "";
      if (mes) {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}financeiro/relatorio/?ano=${ano}&mes=${mes}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}financeiro/relatorio/?ano=${ano}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        console.error(response.status);
        return;
      }
      const data = await response.json();

      setDados(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex sm:flex-row flex-col sm:justify-between items-center">
        <div className="flex flex-col">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Relatório Financeiro {mes && `- ${meses[parseInt(mes) - 1]} de`}{" "}
            {ano}
          </h1>
          <p className="text-muted-foreground text-sm text-center sm:text-right">
            Visão geral das Finanças
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <DialogAno ano={ano} setAno={setAno} />
          <SelectMes setMes={setMes} mes={mes} ativo={selctAtivo} />
        </div>
      </div>

      <div className="container mt-4">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card Entrada */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Entradas
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatReal(dados?.totalReceita)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receitas do ano {ano}
                  </p>
                </CardContent>
              </Card>

              {/* Card Saída */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Saídas
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatReal(dados?.totalDespesa)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Despesas do ano {ano}
                  </p>
                </CardContent>
              </Card>

              {/* Card Saldo */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Saldo Anual
                  </CardTitle>
                  <DollarSign
                    className={`h-4 w-4 ${
                      dados && dados?.total >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      dados && dados.total >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatReal(dados?.total)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dados && dados.total >= 0
                      ? "Resultado positivo"
                      : "Resultado negativo"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart de Caixa */}
            <Card className="mt-4 shadow-md rounded-xl border border-gray-200">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Caixa</h2>
                <div className="grid gap-2 md:grid-cols-4">
                  {dados?.custosPorCaixas.map((caixa) => (
                    <div>
                      <GraficoCaixas data={caixa} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-2">
              <CardContent>
                <GraficoMeses dados={dados?.ano} />
              </CardContent>
            </Card>

            {/* Tabela Centro de Custo */}
            <Card className="mt-2">
              <CardHeader>
                <CardTitle>Centro de Custo</CardTitle>
                <CardDescription>Dados financeiros mês a mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Centro de Custo</TableHead>
                        <TableHead>Receita</TableHead>
                        <TableHead>Despesa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dados?.custosPorCentro.map((item) => (
                        <TableRow key={item.nome}>
                          <TableCell>{item.nome}</TableCell>
                          <TableCell
                            className={
                              item.total.totalReceita < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {item.total.totalReceita
                              ? formatReal(item.total.totalReceita)
                              : "-"}
                          </TableCell>
                          <TableCell
                            className={
                              item.total.totalDespesa <= 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {item.total.totalDespesa
                              ? formatReal(item.total.totalDespesa)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
