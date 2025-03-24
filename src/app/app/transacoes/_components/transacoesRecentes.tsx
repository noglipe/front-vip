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

interface DadosType {
  data: string;
  descricao: string;
  valor: string;
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
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {receita ? " Receitas Recentes" : " Despesas Recentes"}
      </h2>
      <div className="grid grid-cols-1 gap-2">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <tr>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>descricao</TableHead>
              <TableHead className="w-[100px]">Valor</TableHead>
              <TableHead className="w-[100px]">Categoria</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {dados.map((dado, index) => (
              <TableRow key={index} className="overflow-hidden">
                <TableCell>{dado.data}</TableCell>
                <TableCell>{dado.descricao}</TableCell>
                <TableCell>{formatReal(dado.valor)}</TableCell>
                <TableCell className="w-[100px] overflow-hidden">
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
