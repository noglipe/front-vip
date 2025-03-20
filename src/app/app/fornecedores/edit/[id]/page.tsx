"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import InputVip from "../../../_components/inputVip";
import { X } from "lucide-react";
import { useQuery } from "@apollo/client";

import client from "../../../../../lib/apollo-client";
import { FORNECEDOR_QUERY } from "@/graphql/fornecedores-query";

interface Fornecedor {
  id: number;
  nome: string;
  documento: string;
}

export default function EditarFornecedor() {
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useParams();
  const fornecedorId = parseInt(params.id as string);

  const {
    loading: loadingQuery,
    error,
    data,
  } = useQuery<{
    fornecedor: Fornecedor;
  }>(FORNECEDOR_QUERY, {
    variables: { id: fornecedorId },
    client,
  });

  useEffect(() => {
    if (data && data.fornecedor) {
      setFornecedor(data.fornecedor);
    }
    setLoading(loadingQuery);
  }, [data, loadingQuery]);

  const salvarFornecedor = async () => {
    if (!fornecedor) return;

    setSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financeiro/fornecedor/${fornecedor.id}/`, // Endpoint Django Ninja
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fornecedor),
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar fornecedor.");

      alert("Fornecedor atualizado com sucesso!");
      router.push("/app/fornecedores"); // Redireciona para a lista de fornecedores
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar fornecedor.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Carregando...</p>;
  if (error) {
    console.error("Erro na query GraphQL:", error); // Adicionado console.error
    return <p className="text-center text-red-500">{error.message}</p>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white shadow-lg rounded-xl p-6 w-[400px] max-w-full">
        {/* Botão de fechar */}
        <button
          onClick={() => router.push("/app/fornecedores")}
          className="absolute top-2 right-2 flex justify-center items-center rounded-full bg-gray-300 hover:bg-gray-400 h-8 w-8 cursor-pointer transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Editar Fornecedor
        </h2>

        {fornecedor && (
          <div className="flex flex-col gap-4">
            <InputVip
              nome="Nome"
              value={fornecedor.nome}
              setValue={(valor) =>
                setFornecedor({ ...fornecedor, nome: valor })
              }
            />
            <InputVip
              nome="Documento"
              value={fornecedor.documento}
              setValue={(valor) =>
                setFornecedor({ ...fornecedor, documento: valor })
              }
            />
            <button
              className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition ${
                saving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              onClick={salvarFornecedor}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
