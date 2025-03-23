"use client";

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

import { Card, CardContent } from "@/components/UI/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/UI/table";
import { APP_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import client from "../../lib/apollo-client";
import { Loading, MiniLoading } from "@/components/loading";
import { formatReal } from "@/lib/utils";

export default function DashboardFinanceiro() {
  const [dados, setDados] = useState<App | null>(null);
  const { loading, error, data } = useQuery<{ app: App[] }>(APP_QUERY, {
    client,
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      setDados(data);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  const comprasCartao = 3200;

  const transacoesNaoConcluidas = [
    { descricao: "Pagamento fornecedor", valor: 1200, data: "2025-03-10" },
    { descricao: "Compra de material", valor: 800, data: "2025-03-15" },
  ];

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total em cada caixa */}
      {dados?.caixas.map((caixa, index) => (
        <Card key={index} className="p-4">
          <CardContent>
            <h2 className="text-lg font-bold">{caixa.nome}</h2>
            <p className="text-2xl font-semibold">{formatReal(caixa.saldo)}</p>
          </CardContent>
        </Card>
      ))}

      {/* Total em cada instituição financeira */}
      {dados?.instituicoesFinanceiras.map((inst, index) => (
        <Card key={index} className="p-4">
          <CardContent>
            <h2 className="text-lg font-bold">{inst.nome}</h2>
            <p className="text-2xl font-semibold">{formatReal(inst.saldo)}</p>
          </CardContent>
        </Card>
      ))}

      {/* Total de compras do cartão */}
      <Card className="p-4 col-span-1 md:col-span-2">
        <CardContent>
          <h2 className="text-lg font-bold">Compras no Cartão - Inplementar</h2>
          <p className="text-2xl font-semibold text-red-600">
            R$ {comprasCartao.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Lista de transações não concluídas */}
      <Card className="p-4 col-span-full">
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Transações Não Concluídas - Inplementar</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoesNaoConcluidas.map((transacao, index) => (
                <TableRow key={index}>
                  <TableCell>{transacao.descricao}</TableCell>
                  <TableCell>R$ {transacao.valor.toFixed(2)}</TableCell>
                  <TableCell>{transacao.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
