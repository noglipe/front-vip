"use client";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { CATEGORIAS_FORM_QUERY } from "@/graphql/query";
import { useState } from "react";
import { Loading } from "@/components/loading";
import PainelValor from "../../_components/painelValor";
import TabelaTransacoes from "@/app/app/_components/tabelaTransacoes";
import { ApiNovo } from "@/lib/api";
import { toast } from "sonner";

export default function Page() {
  const [categoria, setCategoria] = useState<any>(null);
  const [dados, setDados] = useState<TransacoesPropsApi | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const featchDadosategoria = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiNovo(`financeiro/filtrar/categoria/${id}`);

      const data: TransacoesPropsApi = await response.json();
      setDados(data);
    } catch (error: any) {
      setError(error.message);
      toast.error(`Error ao buscar dados: ${error}`);
      throw new Error(`Error ao buscar dados: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    if (categoria) {
      const categoriaId =
        typeof categoria !== "string" ? categoria.id : parseInt(categoria);
      featchDadosategoria(categoriaId);
    } else {
      alert("Selecione uma categoria para buscar.");
    }
  };

  return (
    <div>
      <Card className="flex">
        <CardContent className="flex flex-col gap-2">
          <SelectBaseBusca
            setFunc={setCategoria}
            query={CATEGORIAS_FORM_QUERY}
            dataKey="categorias"
            minutos={60}
            titulo="Categorias"
            className="w-full"
            value={categoria}
          />
          <div className="flex justify-end">
            <Button onClick={handleBuscar} className="sm:w-16 w-full">
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 p-4">
        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-center text-red-500">Erro: {error}</p>
        ) : dados ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Transações da Categoria
            </h2>
            <Card className="container p-4  rounded-xl">
              <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
                <PainelValor
                  valor={dados.total_receitas}
                  title="Total de Receitas"
                />
                <PainelValor
                  valor={dados.total_despesas}
                  title="Total de Despesas"
                />
                <PainelValor
                  valor={dados.total_receitas + dados.total_despesas}
                  title="Total de Despesas"
                />
              </div>
            </Card>

            {dados && <TabelaTransacoes dados={dados.transacao} />}
          </div>
        ) : (
          <p>
            Selecione uma categoria e clique em "Buscar" para ver as transações.
          </p>
        )}
      </Card>
    </div>
  );
}
