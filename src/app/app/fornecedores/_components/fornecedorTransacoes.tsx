"use client";

import { FORNECEDOR_TRANSACOES_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import { X } from "lucide-react";
import client from "../../../../lib/apollo-client";
import { useRouter } from "next/navigation";
import { MiniLoading } from "@/components/loading";
import { useEffect, useState } from "react";
import { formatData, formatReal } from "@/lib/utils";
import { IfConcluidoCircle } from "../../transacoes/_components/ifConcluido";
import { IfReceitaValor } from "../../transacoes/_components/ifReceita";
import Link from "next/link";

interface Transacao {
  view: boolean;
  id: any;
  setView: (value: boolean) => void;
}

interface FornecedorTransacoes {
  data: string;
  descricao: string;
  valor: number;
  receita: boolean;
  id: number;
  transacaoConcluido: boolean;
}

export default function TransacoesFornecedor({ view, id, setView }: Transacao) {
  if (!view) return null;

  const router = useRouter();
  const [dados, setDados] = useState<FornecedorTransacoes[]>([]);

  const { loading, error, data } = useQuery<{
    transacoesFornecedores: FornecedorTransacoes[];
  }>(FORNECEDOR_TRANSACOES_QUERY, {
    variables: { id: parseInt(id) },
    client,
  });

  useEffect(() => {
    if (data?.transacoesFornecedores) {
      setDados(data.transacoesFornecedores);
    }
  }, [data]);

  if (loading) return <MiniLoading />;
  if (error)
    return (
      <p className="text-center text-red-500">
        {error.name} - {error.message}{" "}
      </p>
    );
  if (!data || data.transacoesFornecedores.length === 0)
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

        {dados &&
          dados.map((obj) => (
            <Link href={`/app/transacoes/${obj.id}/`}>
              <div
                key={obj.id}
                className="grid grid-cols-3 items-center gap-3 p-2 border-b border-gray-200"
              >
                <div className="text-sm text-gray-700 flex gap-1 justify-center items-center">
                  <IfConcluidoCircle concluido={obj.transacaoConcluido} />
                  {formatData(obj.data)}
                </div>
                <div className="text-sm text-gray-800">{obj.descricao}</div>
                <div className="text-sm font-medium">
                  <IfReceitaValor valor={obj.valor} receita={obj.receita} />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
