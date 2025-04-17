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

interface SelectApi {
  id: string;
  nome: string;
}

interface Props<T extends SelectApi> {
  setFunc: (objeto: T) => void;
  query: any;
  minutos?: number;
  dataKey: string;
  titulo?: string;
  className?: string;
  value: T | null;
  filtro?: boolean;
}

export function SelectVip<T extends SelectApi>({
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
  const { loading, error, data, refetch } = useQuery<{ [key: string]: T[] }>(
    query,
    { client }
  );

  useEffect(() => {
    if (data && data[dataKey]) {
      let lista = data[dataKey];
      if (filtro) {
        const todosItem = { id: "todos", nome: "Todos" } as T;
        lista = [todosItem, ...lista];
      }
      setObjetos(lista);
    }
  }, [data, dataKey, filtro]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, minutos ? minutos * 60 * 1000 : 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [refetch, minutos]);

  if (loading) return <MiniLoading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <Select
      onValueChange={(idSelecionado) => {
        const objetoSelecionado = objetos.find((obj) => obj.id === idSelecionado);
        if (objetoSelecionado) setFunc(objetoSelecionado);
      }}
      value={value?.id}
    >
      <SelectTrigger className={`${className} bg-black text-white`}>
        <SelectValue placeholder={titulo ?? dataKey}>
          {value?.nome ?? "Selecione"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className={className}>
        <SelectGroup className={className}>
          {objetos.map((obj) => (
            <SelectItem key={obj.id} value={obj.id.toString()}>
              {obj.nome}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
