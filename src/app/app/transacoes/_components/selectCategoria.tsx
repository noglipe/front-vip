import { useQuery } from "@apollo/client";

import { CATEGORIAS_FORM_QUERY } from "../../../../graphql/query";
import client from "@/lib/apollo-client";
import { useEffect, useState } from "react";

interface Props {
  setFunc: (id: string) => void;
  minutos?: number;
}

export function SelectCategorias({ setFunc, minutos }: Props) {
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const { loading, error, data, refetch } = useQuery<{ categorias: Categoria[] }>(
    CATEGORIAS_FORM_QUERY,
    {
      client,
    }
  );

  useEffect(() => {
    if (data?.categorias) {
      setCategoria(data.categorias);
    }
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        refetch();
      },
      minutos ? minutos * 60 * 1000 : 1 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, [refetch]);

  if (loading)
    return <p className="text-center text-gray-500">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div>
      <select
        onChange={(e) => setFunc(e.target.value)}
        className=" h-full w-full px-2 border-1 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categoria.map((value) => (
          <option key={value.id} value={value.id}>
            {value.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
