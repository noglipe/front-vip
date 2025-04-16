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
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { IfConcluidoCircle } from "../transacoes/_components/ifConcluido";
import { formatData, formatReal } from "@/lib/utils";
import BtnVisualizar from "../transacoes/_components/btnVisualizar";
import { BtnEditar } from "../transacoes/_components/tbnEditar";
import BtnRecibo from "../transacoes/_components/tbnRecibo";
import { Card, CardContent, CardTitle } from "@/components/UI/card";
import { SelectBase } from "@/components/form/selectBase";
import {
  CARTOES_FORM_QUERY,
  CATEGORIAS_FORM_QUERY,
  FORNECEDORES_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
} from "@/graphql/query";
import { Label } from "@/components/UI/label";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";

interface BoxFilterProps {
  label?: string;
  children: React.ReactNode;
}

export function BoxFilter({ label, children }: Readonly<BoxFilterProps>) {
  return (
    <div className="flex-col gap-1">
      {label ?? <Label>{label}</Label>}
      {children}
    </div>
  );
}

export default function TabelaTransacoesFiltros({ dados }: TransacoesListAPi) {
  const [termoDeBusca, setTermoDeBusca] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");
  const [situacaoFiscal, setSituacaoFiscal] = useState<string>("todos");
  const [concluida, setConcluida] = useState<string>("todos");
  const [meioTransacao, setMenioTransacao] = useState<number | any>();
  const [cartao, setCartao] = useState<number | any>();
  const [categoria, setCategoria] = useState<number | any>();
  const [fornecedor, setFornecedor] = useState<number | any>();
  const [instituicaoFinanceira, setInstituicaoFinanceira] = useState<
    number | any
  >();

  const CLASS_RECEITA = "text-green-400 cursor-pointer hover:bg-green-900";
  const CLASS_DESPESA = "text-red-400 cursor-pointer hover:bg-red-900";

  function filtrarTransacoes() {
    if (!dados) return [];

    const termo = termoDeBusca.toLowerCase();

    return dados.filter((transacao) => {
      const matchBusca =
        transacao.descricao.toLowerCase().includes(termo) ||
        transacao.categoria.nome.toLowerCase().includes(termo) ||
        transacao.valor.toString().includes(termo);

      const matchesType =
        filterType === "todos" ||
        (filterType === "receitas" && transacao.receita === true) ||
        (filterType === "despesas" && transacao.receita === false);

      const matchesType2 =
        situacaoFiscal === "todos" ||
        (situacaoFiscal === "Com Nota" && transacao.situacao_fiscal === true) ||
        (situacaoFiscal === "Sem Nota" && transacao.situacao_fiscal === false);

      const matchesConcluida =
        concluida === "todos" ||
        (concluida === "Transacoes Concluidas" &&
          transacao.transacao_concluido === true) ||
        (concluida === "Transacoes Pendentes" &&
          transacao.transacao_concluido === false);

      const matchesMeio =
        !meioTransacao ||
        meioTransacao === "todos" ||
        transacao.meio_de_transacao?.id.toString() === meioTransacao;

      const matchesInstituicao =
        !instituicaoFinanceira ||
        instituicaoFinanceira === "todos" ||
        transacao.instituicao_financeira?.id.toString() ===
          instituicaoFinanceira;

      const matchesCartao =
        !cartao ||
        cartao === "todos" ||
        transacao?.cartao_utilizado?.id.toString() === cartao;

      const matchesCategoria =
        !categoria ||
        categoria === "todos" ||
        transacao.categoria.id.toString() === categoria;

      const matchesFornecedor =
        !fornecedor ||
        fornecedor === "todos" ||
        transacao?.fornecedor?.id.toString() === fornecedor;

      console.log(transacao);
      return (
        matchesFornecedor &&
        matchesCategoria &&
        matchesCartao &&
        matchesInstituicao &&
        matchBusca &&
        matchesType &&
        matchesType2 &&
        matchesConcluida &&
        matchesMeio
      );
    });
  }

  return (
    <Card className="p-4">
      <CardContent>
        <CardTitle className="mb-4">Transações</CardTitle>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10"
                value={termoDeBusca}
                onChange={(e) => setTermoDeBusca(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ml-2">
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

              <Select value={situacaoFiscal} onValueChange={setSituacaoFiscal}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">TODAS</SelectItem>
                  <SelectItem value="Com Nota">Com Nota</SelectItem>
                  <SelectItem value="Sem Nota">Sem Nota</SelectItem>
                </SelectContent>
              </Select>

              <Select value={concluida} onValueChange={setConcluida}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">TODAS</SelectItem>
                  <SelectItem value="Transacoes Concluidas">
                    Transacoes Concluidas
                  </SelectItem>
                  <SelectItem value="Transacoes Pendentes">
                    Transacoes Pendentes
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className=" flex flex-row gap-4">
            <BoxFilter label="Meio de Transação">
              <SelectBase
                setFunc={setMenioTransacao}
                value={meioTransacao}
                query={MEIO_TRANSACAO_FORM_QUERY}
                dataKey="meiosDeTransacao"
                minutos={60}
                titulo="Meios de Transações"
                className={"w-[180px]"}
                filtro
              />
            </BoxFilter>
            <BoxFilter label="Instituição Financeira">
              <SelectBase
                setFunc={setInstituicaoFinanceira}
                query={INSTITUICAO_FINANCEIRA_FORM_QUERY}
                dataKey="instituicoesFinanceiras"
                minutos={60}
                titulo="Instituições Financeiras"
                className={"w-[180px]"}
                value={instituicaoFinanceira}
                filtro
              />
            </BoxFilter>
            <BoxFilter label="Cartão Utilizado">
              <SelectBase
                setFunc={setCartao}
                query={CARTOES_FORM_QUERY}
                dataKey="cartoesDeCredito"
                minutos={60}
                titulo="Cartão Utilizado"
                className={"w-[180px]"}
                value={cartao}
                filtro
              />
            </BoxFilter>
            <BoxFilter label="Categoria">
              <SelectBaseBusca
                setFunc={setCategoria}
                query={CATEGORIAS_FORM_QUERY}
                dataKey="categorias"
                minutos={60}
                titulo="Categorias"
                className={"w-[180px] bg-transparent"}
                value={categoria}
                filtro
              />
            </BoxFilter>
            <BoxFilter label="Fornecedor">
              <SelectBaseBusca
                setFunc={setFornecedor}
                query={FORNECEDORES_QUERY}
                dataKey="fornecedores"
                minutos={1}
                titulo="Fornecedores"
                className={"w-[180px] bg-transparent"}
                value={fornecedor}
                filtro
              />
            </BoxFilter>
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
              filtrarTransacoes().map((transacao, index) => (
                <TableRow
                  key={index}
                  className={transacao.receita ? CLASS_RECEITA : CLASS_DESPESA}
                >
                  <TableCell className="justify-center items-center gap-1">
                    <div className="flex justify-center items-center text-center gap-1">
                      <IfConcluidoCircle
                        concluido={
                          transacao.transacaoConcluido
                            ? transacao.transacaoConcluido
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
