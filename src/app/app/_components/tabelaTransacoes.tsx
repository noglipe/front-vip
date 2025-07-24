"use client";

import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { FilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/UI/card";
import TabelaT from "./TabelaT";

export default function TabelaTransacoes({ dados }: TransacoesListAPi) {
  const [termoDeBusca, setTermoDeBusca] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");

  const filtrarTransacoes = dados
    ? dados.filter((transacao) => {
        const matchBusca =
          transacao.descricao
            .toLowerCase()
            .includes(termoDeBusca.toLowerCase()) ||
          transacao.categoria.nome
            .toLowerCase()
            .includes(termoDeBusca.toLowerCase()) ||
          transacao.valor.toString().includes(termoDeBusca.toLowerCase());

        const matchesType =
          filterType === "todos" ||
          (filterType === "receitas" && transacao.receita === true) ||
          (filterType === "despesas" && transacao.receita === false);

        return matchBusca && matchesType;
      })
    : "";

  return (
    <Card className="p-4">
      <CardContent>
        <CardTitle className="mb-4">FILTROS</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transações..."
              className="pl-10"
              value={termoDeBusca}
              onChange={(e) => setTermoDeBusca(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">TODAS</SelectItem>
                <SelectItem value="receitas">Receitas</SelectItem>
                <SelectItem value="despesas">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

       <TabelaT transacoes={filtrarTransacoes}/>
      </CardContent>
    </Card>
  );
}
