"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { FORNECEDORES_QUERY } from "@/graphql/query";
import client from "../../../../lib/apollo-client";

import { ListFilter, PenLine, Search } from "lucide-react";
import { Loading } from "@/components/loading";
import { Card } from "@/components/UI/card";

interface Fornecedor {
  id: number;
  nome: string;
  documento: string;
}

interface PropsList {
  setView: (id: number) => void;
  onRefetchReady?: (refetchFn: () => void) => void;
}

export function FornecedorLista({ setView, onRefetchReady }: PropsList) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { loading, error, data, refetch } = useQuery<{
    fornecedores: Fornecedor[];
  }>(FORNECEDORES_QUERY, { client });
  const router = useRouter();

  useEffect(() => {
    if (onRefetchReady) {
      onRefetchReady(refetch);
    }
  }, [refetch, onRefetchReady]);

  useEffect(() => {
    if (data?.fornecedores) {
      setFornecedores(data.fornecedores);
    }
  }, [data]);

  const filteredFornecedores = fornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <Card className="flex-2  shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Lista de Fornecedores
      </h2>

      {/* Campo de Busca */}
      <div className="flex items-center mb-4 border rounded-lg p-2 ">
        <Search size={18} className=" mr-2" />
        <input
          type="text"
          placeholder="Buscar fornecedor..."
          className="w-full bg-transparent outline-none "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFornecedores.length > 0 ? (
          filteredFornecedores.map((fornecedor) => (
            <div
              key={fornecedor.id}
              className="flex justify-between items-center p-4 rounded-lg shadow-sm border-b-amber-200 border"
            >
              <div className="">
                <p className="text-lg font-medium">{fornecedor.nome}</p>
                {fornecedor.documento && (
                  <p className=" text-sm">Documento: {fornecedor.documento}</p>
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
          <p className="text-center">Nenhum fornecedor encontrado.</p>
        )}
      </div>
    </Card>
  );
}
