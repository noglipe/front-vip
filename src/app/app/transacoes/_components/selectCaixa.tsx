import { useQuery } from "@apollo/client";

import { CAIXAS_FORM_QUERY } from "../../../../graphql/query";
import client from "@/lib/apollo-client";
import { useEffect, useState } from "react";

interface Props {
  setFunc: (id: string) => void;
  minutos?: number;
}

export function SelectCaixa({ setFunc, minutos }: Props) {
  const [caixas, setCaixas] = useState<Caixa[]>([]);
  const { loading, error, data } = useQuery<{ caixas: Caixa[] }>(
    CAIXAS_FORM_QUERY,
    {
      client,
    }
  );

  useEffect(() => {
    if (data?.caixas) {
      setCaixas(data.caixas);
    }
  }, [data]);


  if (loading)
    return <p className="text-center text-gray-500">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div>
      <select
        onChange={(e) => setFunc(e.target.value)}
        className="w-full p-2 border-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {caixas.map((value) => (
          <option key={value.id} value={value.id}>
            {value.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
