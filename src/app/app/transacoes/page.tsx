"use client";

import { useQuery } from "@apollo/client";
import { TRANSACOES_MES_QUERY } from "@/graphql/query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/UI/table";
import { Card, CardContent } from "@/components/UI/card";
import { Loading } from "@/components/loading";
import { formatData, formatReal } from "@/lib/utils";
import { useEffect, useState } from "react";
import client from "../../../lib/apollo-client";
import {
  CircleCheckBig,
  CircleEllipsis,
  EyeIcon,
  Pencil,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Recibo from "./recibo/[id]/page";
import { Button } from "@/components/UI/button";

interface TransacoesMes {
  totalDespesas: number;
  totalReceitas: number;
  transacoes: {
    id: string;
    receita: boolean;
    transacaoConcluido: boolean;
    data: string;
    descricao: string;
    valor: number;
    categoria: {
      id: string;
      nome: string;
    };
    meioDeTransacao: {
      id: string;
      nome: string;
    };
    instituicaoFinanceira?: {
      id: string;
      nome: string;
    };
  }[];
}

export default function Page() {
  const router = useRouter();
  const [dados, setDados] = useState<TransacoesMes | null>(null);
  const { loading, error, data } = useQuery<{ transacoesMes: TransacoesMes }>(
    TRANSACOES_MES_QUERY,
    { client }
  );

  useEffect(() => {
    if (data?.transacoesMes) {
      console.log(data.transacoesMes);
      setDados(data.transacoesMes);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error)
    return <p className="text-center text-red-500">Erro: {error.message}</p>;

  const diferenca = (dados?.totalReceitas || 0) - (dados?.totalDespesas || 0);

  const CLASS_RECEITA = "text-green-900 cursor-pointer";
  const CLASS_DESPESA = "text-red-900 cursor-pointer";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Totais Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-green-100">
          <CardContent>
            <h2 className="text-lg font-bold text-green-800">
              Total de Receitas
            </h2>
            <p className="text-3xl font-semibold">
              {formatReal(dados?.totalReceitas || 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 bg-red-100">
          <CardContent>
            <h2 className="text-lg font-bold text-red-800">
              Total de Despesas
            </h2>
            <p className="text-3xl font-semibold">
              {formatReal(dados?.totalDespesas || 0)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`p-4 ${diferenca >= 0 ? "bg-green-200" : "bg-red-200"}`}
        >
          <CardContent>
            <h2
              className={`text-lg font-bold ${
                diferenca >= 0 ? "text-green-800" : "text-red-800"
              }`}
            >
              Diferença (Lucro / Prejuízo)
            </h2>
            <p className="text-3xl font-semibold">{formatReal(diferenca)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transações */}
      <Card className="p-4">
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Transações do Mês Vigente</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Descrição / Categoria</TableHead>
                <TableHead>Meio de Pagamento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados?.transacoes.map((transacao, index) => (
                <TableRow
                  key={index}
                  className={transacao.receita ? CLASS_RECEITA : CLASS_DESPESA}
                >
                  <TableCell className="flex flex-col justify-center items-center gap-1">
                    {transacao.transacaoConcluido ? (
                      <CircleCheckBig className="text-green-600" />
                    ) : (
                      <CircleEllipsis className="text-gray-500" />
                    )}
                    <div className="font-bold uppercase">
                      {transacao.receita ? "Receita" : "Despesa"}
                    </div>
                  </TableCell>
                  <TableCell>{formatData(transacao.data)}</TableCell>
                  <TableCell>
                    {transacao.descricao} / {transacao.categoria.nome}
                  </TableCell>
                  <TableCell>
                    {transacao.meioDeTransacao.nome} /{" "}
                    {transacao.instituicaoFinanceira?.nome || "N/A"}
                  </TableCell>
                  <TableCell>{formatReal(transacao.valor)}</TableCell>
                  <TableCell className="flex flex-row gap-2 items-center justify-center">
                    <Button
                      onClick={() =>
                        router.push(`/app/transacoes/${transacao.id}`)
                      }
                    >
                      <EyeIcon className="mr-2" size={16} /> Visualizar
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(`/app/transacoes/recibo/${transacao.id}`)
                      }
                    >
                      <Printer className="mr-2" size={16} /> Recibo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
