"use client";

import { RECEITA_LIST_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import client from "../../../../../lib/apollo-client";
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

import {formatReal} from "../../../../../lib/utils"

interface Receitas {
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

export default function ReceitaLista() {
  const [receitas, setReceitas] = useState<Receitas[]>([]);
  const { loading, error, data } = useQuery<{ receitas: Receitas[] }>(
    RECEITA_LIST_QUERY,
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
        Receitas Recentes
      </h2>
      <div className="grid grid-cols-1 gap-2">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead>descricao</TableHead>
            <TableHead className="w-[100px]">Valor</TableHead>
            <TableHead className="">Categoria</TableHead>
          </TableHeader>
          <TableBody>
            {receitas.map((receita, index) => (
              <TableRow key={index}>
                <TableCell>{receita.data}</TableCell>
                <TableCell>{receita.descricao}</TableCell>
                <TableCell>{formatReal(receita.valor)}</TableCell>
                <TableCell>{receita.categoria.nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
