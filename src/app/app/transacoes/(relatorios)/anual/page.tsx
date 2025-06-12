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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/accordion";
import { ScrollArea } from "@/components/UI/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";

type Custos = {
  nome: string;
  total: {
    totalReceita: number;
    totalDespesa: number;
  };
};

interface DadosRelatorio {
  totalReceita: number;
  totalDespesa: number;
  total: number;
  custosPorCentro: Custos[];
  custosPorCaixas: Custos[];
}

export default function page() {
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
        console.log(response.status);
      }

      const data = await response.json();

      console.log(data);

      setDados(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Relatório Financeito {mes && `- ${meses[parseInt(mes) - 1]} de`}{" "}
            {ano}{" "}
          </h1>
          <p className="text-muted-foreground text-sm">
            Visão geral das Financas
          </p>
        </div>
        <div className=" flex flex-row gap-2">
          <DialogAno ano={ano} setAno={setAno} />
          <SelectMes setMes={setMes} mes={mes} ativo={selctAtivo} />
        </div>
      </div>
      <div className="container mt-2">
        {loading ? (
          <Loading />
        ) : (
          dados && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Saldo Anual
                    </CardTitle>
                    <DollarSign
                      className={`h-4 w-4 ${
                        dados.total >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        dados.total >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatReal(dados?.total)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dados.total >= 0
                        ? "Resultado positivo"
                        : "Resultado negativo"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-4 shadow-md rounded-xl border border-gray-200">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Caixa</h2>

                  <Accordion
                    type="single"
                    collapsible
                    className="grid gap-4 md:grid-cols-4"
                  >
                    {dados.custosPorCaixas.map((v) => (
                      <div 
                        key={v.nome}
                        className="border rounded-lg p-4 shadow-sm bg-muted/50 hover:bg-muted transition-all duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium mb-2">{v.nome}</h3>

                          <div className="text-sm">
                            <p className="font-semibold">
                              {formatReal(
                                (v.total.totalReceita || 0) -
                                  (v.total.totalDespesa || 0)
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between ">
                          <div className="text-sm">
                            <p className="text-muted-foreground">Receita</p>
                            <p className="font-medium">
                              {formatReal(v.total.totalReceita)}
                            </p>
                          </div>

                          <div className="text-sm">
                            <p className="text-muted-foreground">Despesa</p>
                            <p className="font-medium">
                              {formatReal(v.total.totalDespesa)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

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
                        {dados.custosPorCentro.map((item) => (
                          <TableRow key={item.nome}>
                            <TableCell>{item.nome}</TableCell>
                            <TableCell
                              className={`${
                                item.total.totalReceita < 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {item.total.totalReceita
                                ? formatReal(item.total.totalReceita)
                                : "-"}
                            </TableCell>
                            <TableCell
                              className={`${
                                item.total.totalDespesa <= 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
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
              <div className="grid grid-cols-1 gap-6"></div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
