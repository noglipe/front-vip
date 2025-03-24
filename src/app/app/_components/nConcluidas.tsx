"use client";

import { Card, CardContent } from "@/components/UI/card";
import { formatReal } from "@/lib/utils";
import { useEffect, useState } from "react";
import client from "../../../lib/apollo-client";
import { useQuery } from "@apollo/client";
import { APP_QUERY, N_CONCLIDAS_QUERY } from "@/graphql/query";
import { Loading } from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";

interface nConcluidas {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: {
    nome: string;
  };
}

export default function NConclidas() {
  const [dados, setDados] = useState<nConcluidas[]>();
  const { loading, error, data } = useQuery<{ nConcluidas: nConcluidas[] }>(
    N_CONCLIDAS_QUERY,
    {
      client,
    }
  );

  useEffect(() => {
    if (data?.nConcluidas) {
      setDados(data.nConcluidas);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 col-span-full">
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Transações Não Concluídas</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados?.map((dado, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {dado.descricao} / {dado.categoria.nome}
                  </TableCell>
                  <TableCell>{formatReal(dado.valor)}</TableCell>
                  <TableCell>{dado.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
