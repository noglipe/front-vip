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
}

export default function TransacoesRecentes({ receita, query }: TRProps) {
  const [receitas, setReceitas] = useState<DadosType[]>([]);
  const { loading, error, data } = useQuery<{ [key: string]: DadosType[] }>(
    query,
    { client }
  );

  useEffect(() => {
    if (data?.receitas) {
      setReceitas(data.receitas);
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
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead>descricao</TableHead>
            <TableHead className="w-[100px]">Valor</TableHead>
            <TableHead className="w-[100px]">Categoria</TableHead>
          </TableHeader>
          <TableBody>
            {receitas.map((receita, index) => (
              <TableRow key={index} className="w-[400px] overflow-hidden">
                <TableCell>{receita.data}</TableCell>
                <TableCell>{receita.descricao}</TableCell>
                <TableCell>{formatReal(receita.valor)}</TableCell>
                <TableCell className="w-[100px] overflow-hidden">{receita.categoria.nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
