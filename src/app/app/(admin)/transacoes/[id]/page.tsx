"use client";

import { useQuery } from "@apollo/client";
import { DETALHES_TRANSACAO_QUERY } from "@/graphql/query";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/UI/card";
import { Loading } from "@/components/loading";
import { formatData, formatReal } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import client from "../../../../../lib/apollo-client";
import {
  CircleCheckBig,
  CircleEllipsis,
  Trash2,
  ArchiveRestore,
  File,
  Infinity,
  BookDashed,
  BookA,
  Info,
  PiggyBankIcon,
  Landmark,
} from "lucide-react";
import { useEffect, useState } from "react";
import TransacaoRelacionadas from "../_components/transacaoRelacionadas";
import { Button } from "@/components/UI/button";
import { IfConcluidoCircle, IfConcluidoText } from "../_components/ifConcluido";
import BtnRecibo from "../_components/tbnRecibo";
import { BtnEditar } from "../_components/tbnEditar";
import { ApiNovo } from "@/lib/api";
import Link from "next/link";

interface Transacao {
  id: string;
  data: string;
  dataCompra: string;
  categoria: {
    id: string;
    nome: string;
  };
  cartaoUtilizado: {
    id: number;
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
  excluida: boolean;
}

export default function DetalhesTransacao() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [dados, setDados] = useState<Transacao>();
  const [dadosArquivos, setDadosArquivos] = useState([]);
  const { loading, error, data } = useQuery<{ transacao: Transacao }>(
    DETALHES_TRANSACAO_QUERY,
    {
      variables: { id },
      client,
    }
  );

  const classTitleSession =
    "text-xl font-bold border-b pb-2 flex gap-2 items-center";

  useEffect(() => {
    const buscarArquivos = async () => {
      try {
        const response = await ApiNovo(
          `financeiro/arquivos-por-transacao/${id}`
        );

        const data2 = await response.json();

        if (response.ok) {
          setDadosArquivos(data2.arquivos);
        } else {
          console.error("Erro ao buscar arquivos:", data);
        }
      } catch (error) {
        console.error("Erro de conexão ao buscar arquivos:", error);
      }
    };

    buscarArquivos();
  }, []);

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

  async function alterarTransacao(id: string, del: boolean) {
    const url_api = del
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}financeiro/transacao/${id}/`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}financeiro/transacao/${id}/restaurar`;

    const mtd = del ? "DELETE" : "PUT";
    const msg = del ? "excluída" : "restaurada";

    try {
      const response = await fetch(url_api, {
        method: mtd,
      });

      if (!response.ok) {
        const msg2 = await response.text();
        console.log(`Erro ao ${msg}: ${msg2}`);
        return;
      }

      alert(`Transação ${msg} com sucesso!`);
      router.push(`/app/transacoes/${id}/`);
      window.location.reload();
    } catch (error) {
      console.error(`Erro ao ${msg} transação:`, error);
      alert(`Erro ao ${msg} transação.`);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <CardTitle className="flex justify-between">
          <div>
            <h1>Transação #{id}</h1>
            <CardDescription>Detalhamendo de Transição</CardDescription>
          </div>
          {/* Status */}
          <div className="flex items-center gap-3 mb-6">
            <IfConcluidoCircle concluido={transacao.transacaoConcluido} />
            <IfConcluidoText concluido={transacao.transacaoConcluido} />
          </div>
        </CardTitle>

        <CardContent className="flex flex-row flex-wrap-reverse sm:flex-col">
          {/* Seções de Dados */}
          <div className="space-y-8">
            {/* Aviso de Transação Excluída */}
            {transacao.excluida && (
              <div className="flex justify-between items-center gap-3 p-4 border border-red-500 rounded-lg bg-red-100 mb-6">
                <div className="flex gap-2">
                  <Trash2 className="text-red-600" size={28} />
                  <span className="text-red-700 text-lg font-semibold">
                    Esta transação foi excluída.
                  </span>
                </div>

                <Button
                  onClick={() => alterarTransacao(transacao.id, false)}
                  className="flex gap-2"
                >
                  <ArchiveRestore className="text-green-600" size={28} />
                  <span className="text-green-700 text-lg font-semibold">
                    Restaurar
                  </span>
                </Button>
              </div>
            )}

            {/* Dados da Compra */}
            <Card className="p-4">
              <CardTitle className={classTitleSession}>
                <Info /> INFORMAÇÕES
              </CardTitle>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h3 className="scroll-m-20 font-semibold">
                    DATA DA TRANSAÇÃO
                  </h3>
                  <p className="font-semibold">{formatData(transacao.data)}</p>
                </div>
                <div>
                  <h3 className="scroll-m-20 font-semibold">DATA DA COMPRA</h3>
                  <p className="font-semibold">{formatData(transacao.data)}</p>
                </div>
                <div>
                  <h3 className="scroll-m-20 font-semibold">DESCRIÇÃO</h3>
                  <p className="font-semibold">{transacao.descricao}</p>
                </div>
                <div>
                  <h3 className="scroll-m-20 font-semibold">CATEGORIA</h3>
                  <p className="font-semibold">{transacao.categoria.nome}</p>
                </div>
                {transacao.fornecedor && (
                  <div>
                    <h3 className="scroll-m-20 font-semibold">FORNECEDOR</h3>
                    <p className="">{transacao.fornecedor.nome}</p>
                  </div>
                )}
              </CardContent>

              {dadosArquivos.length > 0 && (
                <Card className="p-4">
                  <CardTitle className={classTitleSession}>
                    <File /> Arquivos
                  </CardTitle>
                  <CardContent>
                    <ul>
                      {dadosArquivos.map((arquivo: any, index: number) => (
                        <li key={arquivo.id} className="mb-2">
                          <a
                            href={arquivo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex flex-row gap-1 items-center"
                          >
                            <File size={14} />[{arquivo.tipo}] - {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </Card>

            {/* Informações Bancárias */}
            <Card className="p-4">
              <CardTitle className="flex gap-2 text-xl font-bold border-b pb-2 justify-between">
                <div className="flex gap-2 items-center">
                  <Landmark /> INFORMAÇÕES BANCÁRIAS
                </div>

                {transacao.numeroDeParcelas && (
                  <div>
                    <div className="text-lg font-semibold flex justify-end">
                      Parcelas {transacao.parcelaAtual} /{" "}
                      {transacao.numeroDeParcelas}
                    </div>
                  </div>
                )}
              </CardTitle>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="">MEIO DE PAGAMENTO</h4>
                  <p className="font-semibold">
                    {transacao.meioDeTransacao.nome}
                  </p>
                </div>
                {transacao.cartaoUtilizado !== null && (
                  <div>
                    <p className="">CARTÃO</p>
                    <p className=" font-semibold">
                      {transacao.cartaoUtilizado.nome}
                    </p>
                  </div>
                )}
                <div>
                  <p className="">INSTITUIÇÃO FINANCEIRA</p>
                  <p className="font-semibold">
                    {transacao.instituicaoFinanceira?.nome || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="">VALOR</p>
                  <div
                    className={`text-lg font-semibold ${
                      transacao.receita ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatReal(transacao.valor)}
                  </div>
                </div>
                <div>
                  <p className="">NOTA FISCAL</p>
                  <p className="flex items-center font-semibold">
                    {transacao.situacaoFiscal ? (
                      <CircleCheckBig className="text-green-600" size={32} />
                    ) : (
                      <CircleEllipsis className="text-gray-500" size={32} />
                    )}
                  </p>
                </div>
                <div>
                  {transacao.rastreioParcelas ? (
                    <TransacaoRelacionadas
                      id={transacao?.rastreioParcelas.id}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <Card>
          <CardContent>
            {/* Botões de ação */}
            {!transacao.excluida && (
              <div className="flex justify-end gap-4 mb-4 sm:flex-row flex-col">
                <BtnEditar receita={transacao.receita} id={transacao.id} />
                <BtnRecibo id={transacao.id} />
                <Button
                  onClick={() => alterarTransacao(transacao.id, true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-sm cursor-pointer hover:bg-red-400"
                >
                  <Trash2 size={18} /> Deletar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}
