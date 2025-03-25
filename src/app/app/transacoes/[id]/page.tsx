"use client";

import { useQuery } from "@apollo/client";
import { DETALHES_TRANSACAO_QUERY } from "@/graphql/query";
import { Card, CardContent } from "@/components/UI/card";
import { Loading } from "@/components/loading";
import { formatData, formatReal } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import client from "../../../../lib/apollo-client";
import {
  CircleCheckBig,
  CircleEllipsis,
  FileText,
  Edit,
  Trash2,

} from "lucide-react";
import { useEffect, useState } from "react";
import TransacaoRelacionadas from "../_components/transacaoRelacionadas";

interface Transacao {
  id: string;
  data: string;
  dataCompra: string;
  categoria: {
    id: string;
    nome: string;
  };
  descricao: string;
  fornecedor: {
    id: string;
    nome: string;
  };
  instituicaoFinanceira: {
    id: string;
    nome: string;
  };
  meioDeTransacao: {
    id: string;
    nome: string;
  };
  numeroDeParcelas: number;
  observacao: string;
  parcelaAtual: number;
  rastreioParcelas: {
    id: string;
    valorTotal: number;
  };
  receita: boolean;
  situacaoFiscal: boolean;
  transacaoConcluido: boolean;
  valor: number;
}

export default function DetalhesTransacao() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [dados, setDados] = useState<Transacao>();
  const { loading, error, data } = useQuery<{ transacao: Transacao }>(
    DETALHES_TRANSACAO_QUERY,
    {
      variables: { id },
      client,
    }
  );

  useEffect(() => {
    if (data?.transacao) {
      setDados(data.transacao);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error)
    return <p className="text-center text-red-500">Erro: {error.message}</p>;

  const transacao = data?.transacao;
  if (!transacao)
    return (
      <p className="text-center text-gray-500">Transação não encontrada.</p>
    );

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Detalhes da Transação</h2>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4 mb-4">
            <button 
            onClick={()=>{router.push(`/app/transacoes/recibo/${transacao.id}`)}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-400">
              <FileText size={18} /> Recibo
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg cursor-pointer hover:bg-yellow-500">
              <Edit size={18} /> Editar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-400">
              <Trash2 size={18} /> Deletar
            </button>
            {transacao.rastreioParcelas ? (
              <TransacaoRelacionadas id={transacao?.rastreioParcelas.id} />
            ) : (
              ""
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mb-6">
            {transacao.transacaoConcluido ? (
              <CircleCheckBig className="text-green-600" size={32} />
            ) : (
              <CircleEllipsis className="text-gray-500" size={32} />
            )}
            <span className="text-lg font-semibold">
              {transacao.transacaoConcluido ? "Concluída" : "Pendente"}
            </span>
          </div>

          {/* Seções de Dados */}
          <div className="space-y-8">
            {/* Dados da Compra */}
            <div>
              <h3 className="text-xl font-bold mb-3 border-b pb-2">
                Dados da Compra
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600">Data da Transação</p>
                  <p className="text-lg font-semibold">
                  {formatData(transacao.data)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Data da Compra</p>
                  <p className="text-lg font-semibold">
                    {formatData(transacao.data)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Descrição</p>
                  <p className="text-lg font-semibold">{transacao.descricao}</p>
                </div>
                <div>
                  <p className="text-gray-600">Categoria</p>
                  <p className="text-lg font-semibold">
                    {transacao.categoria.nome}
                  </p>
                </div>
                {transacao.fornecedor && (
                  <div>
                    <p className="text-gray-600">Fornecedor</p>
                    <p className="text-lg font-semibold">
                      {transacao.fornecedor.nome}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Informações Bancárias */}
            <div>
              <h3 className="text-xl font-bold mb-3 border-b pb-2">
                Informações Bancárias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600">Meio de Pagamento</p>
                  <p className="text-lg font-semibold">
                    {transacao.meioDeTransacao.nome}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Instituição Financeira</p>
                  <p className="text-lg font-semibold">
                    {transacao.instituicaoFinanceira?.nome || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Valor</p>
                  <p
                    className={`text-lg font-semibold ${
                      transacao.receita ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatReal(transacao.valor)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Situação Fiscal</p>
                  <p className="flex items-center text-lg font-semibold">
                    {transacao.situacaoFiscal ? (
                      <CircleCheckBig className="text-green-600" size={32} />
                    ) : (
                      <CircleEllipsis className="text-gray-500" size={32} />
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Parcelamento e Transações Relacionadas */}
            {transacao.numeroDeParcelas && (
              <div>
                <h3 className="text-xl font-bold mb-3 border-b pb-2">
                  Parcelamento
                </h3>
                <p className="text-lg font-semibold">
                  {transacao.parcelaAtual} / {transacao.numeroDeParcelas}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
