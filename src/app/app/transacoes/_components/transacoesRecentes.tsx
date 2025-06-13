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

import { formatData, formatReal } from "../../../../lib/utils";
import { useRouter } from "next/navigation";
import { IfConcluidoCircle } from "./ifConcluido";
import { MiniBtnEditar } from "./tbnEditar";

interface DadosType {
  id: string;
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
  const router = useRouter();
  const { loading, error, data } = useQuery<{
    [key: string]: DadosType[];
  }>(query, { client });

  useEffect(() => {
    if (data && data[dataKey]) {
      setDados(data[dataKey]);
    }
  }, [data]);

  if (loading) return <MiniLoading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="grid grid-cols-1 p-6  rounded-lg w-full ">
      <h2 className="text-xl font-bold  mb-6 ">
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
              <TableRow key={index} className="overflow-clip cursor-pointer">
                <TableCell className="flex flex-row gap-2 justify-center items-center">
                  <div
                    onClick={() => {
                      router.push(`/app/transacoes/${dado.id}/`);
                    }}
                  >
                    <IfConcluidoCircle concluido={dado.transacaoConcluido} />
                  </div>
                  <MiniBtnEditar receita={receita} id={dado.id} />
                </TableCell>
                <TableCell>{formatData(dado.data)}</TableCell>
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
