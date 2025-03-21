"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { useQuery } from "@apollo/client";

import client from "@/lib/apollo-client";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
import { Button } from "../UI/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../UI/command";
import Carregando from "../carregando";
import CError from "../cError";

interface Props<T extends SelectApi> {
  setFunc: (id: string) => void;
  query: any;
  minutos?: number;
  dataKey: string;
  titulo?: string;
  className?: string;
}

export function SelectBaseBusca<T extends SelectApi>({
  setFunc,
  query,
  minutos,
  dataKey,
  titulo,
  className,
}: Props<T>) {
  const [objetos, setObjetos] = useState<T[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
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

  if (loading) return <Carregando />;
  if (error) return <CError msg={error.message} />;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={"flex justify-between overflow-hidden " + className}
        >
          {value
            ? objetos.find((obj) => obj.nome === value)?.nome
            : `${titulo}`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="overflow-hidden justify-between h-full w-full px-2 border-1 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ">
        <Command>
          <CommandInput placeholder={`Buscar por ${dataKey}`} className="h-9" />
          <CommandList>
            <CommandEmpty>Não Encontrado</CommandEmpty>
            <CommandGroup>
              {objetos.map((obj) => (
                <CommandItem
                  key={obj.id}
                  value={obj.nome}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setFunc(obj.id);
                    setOpen(false);
                  }}
                >
                  {obj.nome}

                  <Check
                    className={cn(
                      "ml-auto",
                      value === obj.nome ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
