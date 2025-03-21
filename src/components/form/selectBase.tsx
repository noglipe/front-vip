import { useQuery } from "@apollo/client";

import client from "@/lib/apollo-client";
import { useEffect, useState } from "react";

interface Props<T extends SelectApi> {
  setFunc: (id: string) => void;
  query: any;
  minutos?: number;
  dataKey: string;
}

export function SelectBase<T extends SelectApi>({
  setFunc,
  query,
  minutos,
  dataKey,
}: Props<T>) {
  const [objetos, setObjetos] = useState<T[]>([]);
  const { loading, error, data, refetch } = useQuery<{
    [key: string]: T[];
  }>(query, {
    client,
  });

  useEffect(() => {
    if (data && data[dataKey]) {
      setObjetos(data[dataKey]);
    }
  }, [data, dataKey]);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        refetch();
      },
      minutos ? minutos * 60 * 1000 : 60 * 60 * 1000
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
        className="h-full w-full px-2 border-1 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {objetos.map((value) => (
          <option key={value.id} value={value.id.toString()}>
            {value.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
