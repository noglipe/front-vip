"use client";

import { Card, CardContent } from "@/components/UI/card";
import { formatReal } from "@/lib/utils";
import { useEffect, useState } from "react";
import client from "../../../lib/apollo-client";
import { useQuery } from "@apollo/client";
import { CARTAO_MES_QUERY, N_CONCLIDAS_QUERY } from "@/graphql/query";
import { Loading } from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";

interface comprasCartaoMes {
  id: string;
  descricao: string;
  data: string;
  valor: number;
  cartaoUtilizado: {
    nome: string;
    id: string;
  };
  categoria: {
    nome: string;
    id: string;
  };
}

export default function ComprasCartaoMes() {
  const [dados, setDados] = useState<comprasCartaoMes[]>();
  const { loading, error, data } = useQuery<{
    comprasCartaoMes: comprasCartaoMes[];
  }>(CARTAO_MES_QUERY, {
    client,
  });

  useEffect(() => {
    if (data?.comprasCartaoMes) {
      setDados(data.comprasCartaoMes);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 col-span-full">
        <CardContent>
          <h2 className="text-lg font-bold mb-4">
            Compras no Cartão do Mês Vigente
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>data</TableHead>
                <TableHead>descricao</TableHead>
                <TableHead>valor</TableHead>
                <TableHead>cartaoUtilizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados?.map((dado, index) => (
                <TableRow key={index}>
                  <TableCell>{dado.data}</TableCell>
                  <TableCell>
                    {dado.descricao} / {dado.categoria.nome}
                  </TableCell>
                  <TableCell>{formatReal(dado.valor)}</TableCell>
                  <TableCell>{dado.cartaoUtilizado.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
