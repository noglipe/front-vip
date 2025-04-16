"use client";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import { CATEGORIAS_FORM_QUERY } from "@/graphql/query";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { Loading } from "@/components/loading";
import PainelValor from "../../_components/painelValor";
import TabelaTransacoes from "@/app/app/_components/tabelaTransacoes";

export default function Page() {
  const [categoria, setCategoria] = useState<any>(null);
  const [id_categoria, setId_categoria] = useState<number | null>(null);
  const [dados, setDados] = useState<TransacoesData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanco, setBalanco] = useState(0);

  const featchDadosategoria = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}financeiro/filtrar/categoria/${id}`
      );
      if (!response.ok) {
        console.log(response);
        const errorData = await response.json();
        throw new Error(
          errorData?.error ||
            `Erro ao buscar dados da categoria: ${response.status}`
        );
      }
      const data: TransacoesData = await response.json();
      setDados(data);
    } catch (err: any) {
      setError(err.message);
      console.log("Error ao buscar dados:", err);
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
    <div className="container p-4">
      <Card className="p-4">
        <div className="flex flex-row items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <SelectBaseBusca
            setFunc={setCategoria}
            query={CATEGORIAS_FORM_QUERY}
            dataKey="categorias"
            minutos={1}
            titulo="Categorias"
            className="  w-2/3"
            value={categoria}
          />
          <Button onClick={handleBuscar}>Buscar</Button>
        </div>
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
                  valor={dados.total_receitas - dados.total_despesas}
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
