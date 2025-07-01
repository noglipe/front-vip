"use client";

import { Loading } from "@/components/loading";

import { Card } from "@/components/UI/card";
import { url } from "@/lib/apollo-client";
import { useEffect, useState } from "react";
import TabelaTransacoes from "@/app/app/_components/tabelaTransacoes";
import Link from "next/link";
import { ArrowUpToLine } from "lucide-react";
import { ApiNovo } from "@/lib/api";

export default function Page() {
  const [dadosAtualizados, setDadosAtualizados] =
    useState<TransacoesPropsApi>();
  const [dados, setDados] = useState<TransacoesPropsApi>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getDados = async () => {
      setLoading(true);

      const response = await ApiNovo(
        `financeiro/transacao/ultimas-transacoes-atualizadas/`
      );
      setDadosAtualizados(await response.json());

      const response2 = await ApiNovo(
        `financeiro/transacao/ultimas-transacoes-cadastradas/`
      );
      setDados(await response2.json());

      setLoading(false);
    };

    getDados();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">Erro: {error}</p>;

  const diferenca = dados
    ? (dados?.total_receitas || 0) + (dados?.total_despesas || 0)
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

            {dadosAtualizados && (
              <TabelaTransacoes dados={dadosAtualizados.transacao} />
            )}
          </Card>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
