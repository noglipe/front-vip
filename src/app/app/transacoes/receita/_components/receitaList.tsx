"use client";

import { RECEITA_LIST_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import client from "../../../../../lib/apollo-client";
import { useEffect, useState } from "react";
import { Carregando } from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";

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

  if (loading) return <Carregando />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Receitas Recentes</h2>
      <div className="grid grid-cols-1 gap-2">
        {receitas.map((receita, index) => (
          <Card key={index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700">
                {receita.descricao}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 grid grid-cols-2">
              <p className="text-sm text-gray-600">
                <strong>Data:</strong> {new Date(receita.data).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Valor:</strong> <span className="text-green-600 font-semibold">R$ {parseFloat(receita.valor).toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Categoria:</strong> {receita.categoria.nome}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fornecedor:</strong> {receita.fornecedor.nome}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}