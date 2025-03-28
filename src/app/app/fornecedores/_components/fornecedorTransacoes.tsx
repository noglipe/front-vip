"use client";

import { FORNECEDOR_TRANSACOES_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import { X } from "lucide-react";
import client from "../../../../lib/apollo-client";
import { useRouter } from "next/navigation";
import { MiniLoading } from "@/components/loading";
import { useEffect, useState } from "react";

interface Transacao {
  view: boolean;
  id: number | null;
  setView: (value: boolean) => void;
}

interface FornecedorTransacoes {
  data: string;
  descricao: string;
  valor: number;
  receita: string;
  situacaoFiscal: string;
}

export default function FornecedorTransacoes({ view, id, setView }: Transacao) {
  if (!view) return null;

  const router = useRouter();
  const [dados, setDados] = useState<FornecedorTransacoes[]>([]);

  const { loading, error, data } = useQuery<{
    fornecedorTransacoes: FornecedorTransacoes[];
  }>(FORNECEDOR_TRANSACOES_QUERY, {
    variables: { id: id ?? 0 },
    client,
    skip: !id,
  });

  console.log(error?.message);

  useEffect(() => {
    console.log(loading);
    if (data?.fornecedorTransacoes) {
      setDados(data.fornecedorTransacoes);
    }
    console.log(dados);
  }, [data]);

  if (loading) return <MiniLoading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;
  if (!data || data.fornecedorTransacoes.length === 0)
    return <p>Nenhuma transação encontrada.</p>;

  return (
    <div className="flex bg-opacity-50 z-50">
      <div className="relative bg-white shadow-lg rounded-xl p-6 w-[400px] max-w-full">
        {/* Botão de fechar */}
        <button
          onClick={() => setView(false)}
          className="absolute top-2 right-2 flex justify-center items-center rounded-full bg-gray-300 hover:bg-gray-400 h-8 w-8 cursor-pointer transition"
        >
          <X size={18} />
        </button>

        {/* Conteúdo do modal */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Transações do Fornecedor
        </h2>
        <div className="text-center text-4xl font-bold text-gray-700">{id}</div>
      </div>
    </div>
  );
}
