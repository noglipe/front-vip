"use client";

import { Loading } from "@/components/loading";

import { Card } from "@/components/UI/card";
import { url } from "@/lib/apollo-client";
import { useEffect, useState } from "react";
import TabelaTransacoes from "@/app/app/_components/tabelaTransacoes";
import Link from "next/link";
import { ArrowUpToLine } from "lucide-react";

export default function Page() {
  const [dadosA, setDadosA] = useState<TransacoesPropsApi>();
  const [dados, setDados] = useState<TransacoesPropsApi>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`${url}financeiro/transacao/ultimas-transacoes-atualizadas/`)
      .then((res) => {
        return res.json();
      })
      .then((data: TransacoesPropsApi) => {
        setDadosA(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error ao buscar transacoes:", err);
        setError(err);
        setLoading(false);
      });

    fetch(`${url}financeiro/transacao/ultimas-transacoes-cadastradas/`)
      .then((res) => {
        return res.json();
      })
      .then((data: TransacoesPropsApi) => {
        setDados(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error ao buscar transacoes:", err);
        setError(err);
        setLoading(false);
      });

    setLoading(false);
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">Erro: {error}</p>;

  const diferenca = dados
    ? (dados?.total_receitas || 0) - (dados?.total_despesas || 0)
    : 0;

  return (
    <div>
      {dados ? (
        <div className="container mx-auto mt-2 space-y-6">
          <Card id="Topo" className="flex flex-row gap-4 p-4 justify-end">
            <Link href="#UCadastradas" className="hover:text-gray-400">
              Ultimas Transções Cadastradas
            </Link>
            <Link href="#UAtualizadas" className="hover:text-gray-400">
              Ultimas Transções Atualizadas
            </Link>
          </Card>
          {/* Totais Financeiros */}
          <Card id="UAtualizadas" className="container p-4  rounded-xl">
            <h2 className="text-4xl flex gap-2 items-center">
              <span>
                <Link href="#Topo">
                  <ArrowUpToLine />
                </Link>
              </span>
              Ultimas Transações Cadastradas
            </h2>

            {/* Tabela de Transações */}
            {dados && <TabelaTransacoes dados={dados.transacao} />}
          </Card>

          <Card id="UAtualizadas" className="container p-4  rounded-xl">
            <h2 className="text-4xl flex gap-2 items-center">
              <span>
                <Link href="#Topo">
                  <ArrowUpToLine />
                </Link>
              </span>
              Ultimas Transações Atualizadas
            </h2>

            {dadosA && <TabelaTransacoes dados={dadosA.transacao} />}
          </Card>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
