"use client";

import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { FilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { IfConcluidoCircle } from "../transacoes/_components/ifConcluido";
import { formatData, formatReal } from "@/lib/utils";
import BtnVisualizar from "../transacoes/_components/btnVisualizar";
import { BtnEditar } from "../transacoes/_components/tbnEditar";
import BtnRecibo from "../transacoes/_components/tbnRecibo";
import { Card, CardContent, CardTitle } from "@/components/UI/card";

export default function TabelaTransacoes({ dados }: TransacoesListAPi) {
  const [termoDeBusca, setTermoDeBusca] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");

  const CLASS_RECEITA = "text-green-400 cursor-pointer hover:bg-green-900";
  const CLASS_DESPESA = "text-red-400 cursor-pointer hover:bg-red-900";

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
        <CardTitle className="mb-4">Transações</CardTitle>
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Descrição / Categoria</TableHead>
              <TableHead>Meio de Pagamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrarTransacoes &&
              filtrarTransacoes.map((transacao, index) => (
                <TableRow
                  key={index}
                  className={transacao.receita ? CLASS_RECEITA : CLASS_DESPESA}
                >
                  <TableCell className="justify-center items-center gap-1">
                    <div className="flex justify-center items-center text-center gap-1">
                      <IfConcluidoCircle
                        concluido={
                          transacao.transacao_concluido
                            ? transacao.transacao_concluido
                            : false
                        }
                      />
                      <div className="font-bold uppercase">
                        {transacao.receita ? "Receita" : "Despesa"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatData(transacao.data)}</TableCell>
                  <TableCell>
                    {transacao.descricao} / {transacao.categoria.nome}
                  </TableCell>
                  <TableCell>
                    {transacao.meio_de_transacao?.nome || "N/A"} /{" "}
                    {transacao.instituicao_financeira?.nome || "N/A"}
                  </TableCell>
                  <TableCell>{formatReal(transacao.valor)}</TableCell>
                  <TableCell className="grid grid-cols-3 gap-1 items-center justify-center">
                    <BtnVisualizar id={transacao.id.toString()} />
                    <BtnEditar
                      receita={transacao.receita}
                      id={transacao.id.toString()}
                    />
                    <BtnRecibo id={transacao.id.toString()} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
