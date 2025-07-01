"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { FORNECEDORES_QUERY } from "@/graphql/query";
import client from "../../../../../lib/apollo-client";

import { ListFilter, PenLine, Search } from "lucide-react";
import { Loading } from "@/components/loading";
import { Card, CardHeader, CardTitle } from "@/components/UI/card";
import { Button } from "@/components/UI/button";

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
      <CardHeader>
        <CardTitle>
          <h2>LISTA DE FORNECEDORES</h2>
        </CardTitle>
      </CardHeader>

      {/* Campo de Busca */}
      <div className="flex items-center mb-4 border rounded-lg p-2 bg-black ">
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
              className="flex justify-between items-center p-4 rounded-lg shadow-sm border"
            >
              <div className="">
                <p className="text-lg font-medium">{fornecedor.nome}</p>
                {fornecedor.documento && (
                  <p className=" text-sm">Documento: {fornecedor.documento}</p>
                )}
              </div>
              <div className="flex gap-2">
                {/* Botão de edição redireciona para a página de edição */}
                <Button
                  className="flex items-center gap-2  rounded-sm text-sm cursor-pointer"
                  onClick={() =>
                    router.push(`/app/fornecedores/edit/${fornecedor.id}`)
                  }
                >
                  <PenLine size={16} /> Editar
                </Button>

                {/* Botão de transações */}
                <Button
                  onClick={() => setView(fornecedor.id)}
                  className="flex items-center gap-2 rounded-sm text-sm cursor-pointer"
                >
                  <ListFilter size={16} /> Transações
                </Button>
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
