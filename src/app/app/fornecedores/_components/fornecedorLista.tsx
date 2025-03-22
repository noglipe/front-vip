"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { FORNECEDORES_QUERY } from "@/graphql/fornecedores-query";
import client from "../../../../lib/apollo-client";

import { ListFilter, PenLine, Search } from "lucide-react";
import { Carregando } from "@/components/loading";

interface Fornecedor {
  id: number;
  nome: string;
  documento: string;
}

interface PropsList {
  setView: (id: number) => void;
}

export function FornecedorLista({ setView }: PropsList) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, data } = useQuery<{ fornecedores: Fornecedor[] }>(
    FORNECEDORES_QUERY,
    { client }
  );
  const router = useRouter();

  useEffect(() => {
    if (data?.fornecedores) {
      setFornecedores(data.fornecedores);
    }
  }, [data]);

  const filteredFornecedores = fornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <Carregando />
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="flex-2 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Lista de Fornecedores
      </h2>

      {/* Campo de Busca */}
      <div className="flex items-center mb-4 border rounded-lg p-2 bg-gray-100">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Buscar fornecedor..."
          className="w-full bg-transparent outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFornecedores.length > 0 ? (
          filteredFornecedores.map((fornecedor) => (
            <div
              key={fornecedor.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="text-lg font-medium">{fornecedor.nome}</p>
                {fornecedor.documento && (
                  <p className="text-gray-600 text-sm">
                    Documento: {fornecedor.documento}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {/* Botão de edição redireciona para a página de edição */}
                <button
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                  onClick={() =>
                    router.push(`/app/fornecedores/edit/${fornecedor.id}`)
                  }
                >
                  <PenLine size={16} /> Editar
                </button>

                {/* Botão de transações */}
                <button
                  onClick={() => setView(fornecedor.id)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <ListFilter size={16} /> Transações
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Nenhum fornecedor encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
