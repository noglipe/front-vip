"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import FORNECEDORES_QUERY from "@/graphql/fornecedores-query";
import client from "../../../../apollo-client";

import { ListFilter, PenLine } from "lucide-react";
import { FornecedorCadastro } from "./_components/fornecedorCadastro";

interface Fornecedor {
  id: number;
  nome: string;
  documento: string;
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const { loading, error, data } = useQuery<{ fornecedores: Fornecedor[] }>(FORNECEDORES_QUERY, { client });

  useEffect(() => {
    if (data?.fornecedores) {
      setFornecedores(data.fornecedores);
    }
  }, [data]);

  if (loading) return <p className="text-center text-gray-500">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Gerenciamento de Fornecedores</h1>

      <div className="space-y-6">
        <FornecedorCadastro />

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Lista de Fornecedores</h2>
          <div className="space-y-4">
            {fornecedores.length > 0 ? (
              fornecedores.map((fornecedor) => (
                <div
                  key={fornecedor.id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="text-lg font-medium">{fornecedor.nome}</p>
                    {fornecedor.documento && (
                      <p className="text-gray-600 text-sm">Documento: {fornecedor.documento}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">
                      <PenLine size={16} /> Editar
                    </button>
                    <button className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">
                      <ListFilter size={16} /> Transações
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhum fornecedor encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
