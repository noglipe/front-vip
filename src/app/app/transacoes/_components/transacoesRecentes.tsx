"use client";

import { useQuery } from "@apollo/client";
import client from "../../../../lib/apollo-client";
import { useEffect, useState } from "react";
import { MiniLoading } from "@/components/loading";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";

import { formatReal } from "../../../../lib/utils";
import { CircleCheckBig, CircleEllipsis } from "lucide-react";

interface DadosType {
  data: string;
  descricao: string;
  valor: string;
  transacaoConcluido: boolean;
  fornecedor: {
    nome: string;
  };
  categoria: {
    nome: string;
  };
}

interface TRProps {
  receita: boolean;
  query: any;
  dataKey: string;
}

export default function TransacoesRecentes({
  receita,
  query,
  dataKey,
}: TRProps) {
  const [dados, setDados] = useState<DadosType[]>([]);
  const { loading, error, data } = useQuery<{ [key: string]: DadosType[] }>(
    query,
    { client }
  );

  useEffect(() => {
    if (data && data[dataKey]) {
      setDados(data[dataKey]);
    }
  }, [data]);

  if (loading) return <MiniLoading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {receita ? " Receitas Recentes" : " Despesas Recentes"}
      </h2>
      <div className="grid grid-cols-1 gap-2 flex-1">
        <Table>
          <TableCaption>Uma lista das transações mais recentes.</TableCaption>
          <TableHeader>
            <tr>
              <TableHead className="w-[50px]"> </TableHead>
              <TableHead className="w-[50px]">Data</TableHead>
              <TableHead className="w-[50px]">descricao</TableHead>
              <TableHead className="w-[50px]">Valor</TableHead>
              <TableHead className="w-[50px]">Categoria</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {dados.map((dado, index) => (
              <TableRow key={index} className="overflow-clip">
                <TableCell>
                  {dado.transacaoConcluido ? (
                    <CircleCheckBig className="text-green-600 "/>
                  ) : (
                    <CircleEllipsis className="text-gray-500 " />
                  )}
                </TableCell>
                <TableCell>{dado.data}</TableCell>
                <TableCell className="w-[50px] overflow-hidden">
                  {dado.descricao}
                </TableCell>
                <TableCell>{formatReal(dado.valor)}</TableCell>
                <TableCell className="w-[50px] overflow-hidden">
                  {dado.categoria.nome}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
