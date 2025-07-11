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

// Define a interface genérica esperada para os objetos
interface SelectApi {
  id: string | number;
  nome: string;
}

interface Props<T extends SelectApi> {
  setFunc: (obj: T | null) => void;
  query: any;
  minutos?: number;
  dataKey: string;
  titulo?: string;
  className?: string;
  value?: T | null;
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
  }>(query, { client });

  // Carrega e atualiza a lista de objetos
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

  // Recarrega periodicamente
  useEffect(() => {
    const intervalId = setInterval(
      () => refetch(),
      (minutos ?? 60) * 60 * 1000
    );
    return () => clearInterval(intervalId);
  }, [refetch, minutos]);

  if (loading) return <MiniLoading />;
  if (error)
    return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <Select
      onValueChange={(idSelecionado) => {
        const selecionado = objetos.find(
          (obj) => obj.id.toString() === idSelecionado
        );
        setFunc(selecionado ?? null);
      }}
      value={value?.id?.toString()}
    >
      <SelectTrigger className={`${className} bg-black text-white`}>
        <SelectValue placeholder={titulo ?? dataKey}>
          {objetos.find((obj) => obj.id.toString() === value?.id?.toString())
            ?.nome ?? "Selecione"}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className={className}>
        <SelectGroup>
          <SelectItem key={"0"} value={"0"}>
            NENHUM
          </SelectItem>
          {objetos.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.nome}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
