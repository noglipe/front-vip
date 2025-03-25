"use client";

import { RECIBO_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import client from "../../../../../lib/apollo-client";
import { formatReal } from "@/lib/utils";
import { ENDERECO_IGREJA, NOME_IGREJA } from "@/lib/constantes";

type Transacao = {
  id: string;
  valor: number;
  descricao: string;
  data: string;
  fornecedor: {
    nome: string;
    documento: string;
  };
  compraParcelada: boolean;
  numeroDeParcelas: number;
  parcelaAtual: number;
  observacao?: string;
};

export default function Recibo() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [dados, setDados] = useState<Transacao>();
  const [numeroPorExtenso, setNumeroPorExtenso] = useState("");
  const { loading, error, data } = useQuery<{ transacao: Transacao }>(
    RECIBO_QUERY,
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

  const imprimirRecibo = () => window.print();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4
    print:items-start print:justify-start print:h-full print:w-screen print:m-0
    "
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-800 
      max-w-lg print:max-w-full w-full print:w-full print:rounded-none print:shadow-none "
      >
        {/* Título */}
        <h1 className="text-2xl font-bold text-center mb-2">
          RECIBO {dados && formatReal(Math.abs(dados.valor))}
        </h1>
        <h3 className="text-lg font-semibold text-center">{NOME_IGREJA}</h3>

        {/* Dados da Igreja */}
        <div className="text-center text-sm mt-2 leading-tight print:text-xs">
          <ENDERECO_IGREJA />
        </div>

        <hr className="my-4 border-gray-800" />

        {/* Dados do Recibo */}
        <p className="text-sm">
          <strong>Recebemos de:</strong> {NOME_IGREJA}
        </p>
        <p className="text-sm">
          <strong>A supracitada importância de :</strong>{" "}
          {dados && formatReal(dados.valor)}
        </p>
        <p>{dados ? (dados.valor) : ""}</p>
        <p className="text-sm">
          <strong>Referente a:</strong> {dados && dados.descricao}
        </p>
        <p className="text-sm">
          <strong>Documento:</strong>{" "}
          {dados?.fornecedor.documento && dados.fornecedor.documento}
        </p>

        {dados?.compraParcelada ? (
          <p className="text-sm">
            <strong>Observação:</strong> {dados.descricao} - Parcela:{" "}
            {dados.parcelaAtual} / {dados.numeroDeParcelas}
          </p>
        ) : (
          <p className="text-sm">
            <strong>Observação:</strong> {dados?.observacao}
          </p>
        )}

        <hr className="my-4 border-gray-800" />

        {/* Data e Assinatura */}
        <p className="text-right text-sm print:text-xs">
          Vila Velha-ES,{" "}
          {new Date(dados?.data || "").toLocaleDateString("pt-BR")}
        </p>

        <div className="text-center mt-6">
          <p className="border-t-2 border-gray-800 w-3/4 mx-auto pt-2">
            Assinatura
          </p>
          <p className="text-sm">{dados?.fornecedor.nome}</p>
        </div>
      </div>

      {/* Botões de ação (não aparecem na impressão) */}
      <div className="mt-4 flex space-x-4 print:hidden">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={imprimirRecibo}
        >
          Imprimir Recibo
        </button>
        <button
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => router.push(`/app/transacoes/${dados?.id}`)}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
