"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import FORNECEDORES_QUERY from "@/graphql/fornecedores-query";
import client from "../../../../apollo-client";

import { ListFilter, PenLine } from "lucide-react";
import { FornecedorEdicao } from "./_components/fornecedorEdicao";
import { FornecedorCadastro } from "./_components/fornecedorCadastro";

interface Fornecedor {
  id: number;
  nome: string;
  documento: string;
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [fornecedorEditando, setFornecedorEditando] =
    useState<Fornecedor | null>(null);

  const { loading, error, data } = useQuery<{ fornecedores: Fornecedor[] }>(
    FORNECEDORES_QUERY,
    {
      client,
    }
  );

  useEffect(() => {
    if (data && data.fornecedores) {
      setFornecedores(data.fornecedores);
    }
  }, [data]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error.message}</p>;

  const handleEditar = (fornecedor: Fornecedor) => {
    setFornecedorEditando(fornecedor);
  };

  const handleSalvarEdicao = async (fornecedorAtualizado: Fornecedor) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}seu_app/fornecedores/${fornecedorAtualizado.id}/`, // Substitua 'seu_app'
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fornecedorAtualizado),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.mensagem);

      client.refetchQueries({ include: [FORNECEDORES_QUERY] });
      setFornecedorEditando(null);
    } catch (error) {
      console.error("Erro ao editar fornecedor:", error);
    }
  };

  const handleCancelarEdicao = () => {
    setFornecedorEditando(null);
  };
  return (
    <div className="container p-4">
      <h1 className="text-4xl font-bold mb-4">Gerenciamento de Fornecedores</h1>

      <div className="flex flex-col flex-wrap gap-2">
        <FornecedorCadastro />
        {fornecedorEditando && (
          <FornecedorEdicao
            fornecedor={fornecedorEditando}
            onSalvar={handleSalvarEdicao}
            onCancelar={handleCancelarEdicao}
          />
        )}

        <div className="bg-muted m-4 rounded-xl shadow-xl w-[700px]">
          {/* Lista de Fornecedores */}
          <div className="mb-4 p-4">
            <h2 className="text-xl font-semibold mb-1">
              Lista de Fornecedores
            </h2>
            <div className="flex flex-col gap-2 mt-2 ">
              {fornecedores.slice().map((fornecedor) => (
                <div
                  key={fornecedor.id}
                  className="mb-2 flex justify-between items-center w-full"
                >
                  <div className="pr-4">
                    <p className="text-lg font-medium">{fornecedor.nome}</p>
                    {fornecedor.documento ? (
                      <p className="text-gray-600">
                        Documento: {fornecedor.documento}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditar(fornecedor)}
                      className="flex gap-2 bg-gray-400 hover:bg-gray-600 
                    hover:cursor-pointer hover:text-white px-2 py-1 rounded-sm "
                    >
                      <PenLine /> Editar
                    </button>
                    <button
                      className="flex gap-2 bg-gray-400 hover:bg-gray-600 hover:cursor-pointer
                    hover:text-white  px-2 py-1 rounded-sm"
                    >
                      <ListFilter /> Transações
                    </button>
                  </div>
                </div>
              ))}
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
