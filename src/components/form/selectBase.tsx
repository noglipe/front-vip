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
  setFunc: (id: string) => void;
  query: any;
  minutos?: number;
  dataKey: string;
  titulo?: string;
  className?: string;
}

export function SelectBase<T extends SelectApi>({
  setFunc,
  query,
  minutos,
  dataKey,
  titulo,
  className,
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

  if (loading) return <MiniLoading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <Select onValueChange={(e) => setFunc(e)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={titulo ? titulo : `${dataKey}`} />
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
