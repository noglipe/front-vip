import { useQuery } from "@apollo/client";

import client from "@/lib/apollo-client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";
import { MiniLoading } from "../loading";

interface Props<T extends SelectApi> {
  setFunc: (id: number) => void;
  query: any;
  minutos?: number;
  dataKey: string;
  titulo?: string;
  className?: string;
  value:
    | {
        id: string;
        nome: string;
      }
    | any;
  filtro?: boolean;
}

export function SelectBase<T extends SelectApi>({
  setFunc,
  query,
  minutos,
  dataKey,
  titulo,
  className,
  value,
  filtro = false,
}: Props<T>) {
  const [objetos, setObjetos] = useState<T[]>([]);
  const { loading, error, data, refetch } = useQuery<{
    [key: string]: T[];
  }>(query, {
    client,
  });

  useEffect(() => {
    if (data && data[dataKey]) {
      let lista = data[dataKey];
      if (filtro) {
        // Adiciona a opção "Todos" no início
        const todosItem = { id: "todos", nome: "Todos" } as T;
        lista = [todosItem, ...lista];
      }
      setObjetos(lista);
    }
  }, [data, dataKey, filtro]);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        refetch();
      },
      minutos ? minutos * 60 * 1000 : 60 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, [refetch]);

  if (loading) return <MiniLoading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <Select
      onValueChange={(e) => setFunc(parseInt(e))}
      value={typeof value === "string" ? value : value?.id}
    >
      <SelectTrigger className={`${className} bg-black text-white`}>
        <SelectValue placeholder={titulo ?? dataKey}>
          {objetos.find((obj) => obj.id === value?.id)?.nome}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className={className}>
        <SelectGroup className={className}>
          {objetos.map((value) => (
            <SelectItem
              className={className}
              key={value.id}
              value={value.id.toString()}
            >
              {value.nome}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
