"use client";

interface Transacao {
  id: string;
  meioDeTransacao: {
    id: number;
    nome: string;
  };
  transacaoConcluido: boolean;
  situacaoFiscal: boolean;
  excluida: boolean;
  fornecedor: {
    id: string;
    nome: string;
  };
  cartaoUtilizado: {
    id: string;
    nome: string;
  };
  categoria: {
    id: string;
    nome: string;
  };
  compraParcelada: boolean;
  numeroDeParcelas: number;
  observacao: string;
  parcelaAtual: number;
  data: string;
  dataCompra: string;
  descricao: string;
  instituicaoFinanceira: {
    id: string;
    nome: string;
  };
  valor: number;
  receita: boolean;
}

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DatePickerForm } from "../../../../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import {
  CARTOES_FORM_QUERY,
  CATEGORIAS_FORM_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
  FORNECEDORES_QUERY,
  TRANSACAO_DESPESA_QUERY,
} from "@/graphql/query";
import { Checkbox } from "@/components/UI/checkbox";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { z } from "zod";
import { Loading, MiniLoading } from "@/components/loading";
import { Switch } from "@/components/UI/switch";

import { useQuery } from "@apollo/client";
import client from "../../../../../../../lib/apollo-client";

import { ApiNovo } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { parseISO } from "date-fns";

export default function EditarDespesaPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [compra_parcelada, setCompraParcelada] = useState(false);
  const [instituicao_financeira, setinstituicaoFinanceira] = useState<any>();
  const [categoria, setCategoria] = useState<any>();
  const [cartao_utilizado, setCartao] = useState<any>();
  const [meio_de_transacao, setMeioTransacao] = useState<any>();
  const [date, setDate] = React.useState<any>();
  const [date_compra, setDateCompra] = React.useState<any>();
  const [transacao_concluido, setConcluida] = useState(true);
  const [fornecedor, setFornecedores] = useState<number | any>();
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valor, setValor] = useState<number | any>();
  const [parcela_atual, setParcelasAtual] = useState<number | any>(1);
  const [numero_de_parcelas, setNumParcelas] = useState<number | any>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [situacao_fiscal, setSituacao_fiscal] = useState(true);
  const [excluido, setExcluido] = useState(true);
  const [receita, setReceita] = useState(true);

  const { loading, error, data } = useQuery<{ transacao: Transacao }>(
    TRANSACAO_DESPESA_QUERY,
    { variables: { id }, client }
  );

  //Busca de Dados
  useEffect(() => {
 
    if (data?.transacao) {
      const t = data.transacao;

      // Converte strings ISO para objetos Date
      const parsedData = t.data ? parseISO(t.data) : undefined;
      const parsedDataCompra = t.dataCompra
        ? parseISO(t.dataCompra)
        : undefined;

      setDate(parsedData);
      setDateCompra(parsedDataCompra);

      setCompraParcelada(data.transacao.compraParcelada);
      setValor(data.transacao.valor);
      setCategoria(data.transacao.categoria);
      setMeioTransacao(data.transacao.meioDeTransacao);
      setinstituicaoFinanceira(data.transacao.instituicaoFinanceira);
      setCartao(data.transacao.cartaoUtilizado);
      setDescricao(data.transacao.descricao);
      setObservacao(data.transacao.observacao || "");
      setFornecedores(data.transacao.fornecedor);
      setConcluida(data.transacao.transacaoConcluido);
      setSituacao_fiscal(data.transacao.situacaoFiscal);
      setExcluido(data.transacao.excluida);
      setNumParcelas(data.transacao.numeroDeParcelas);
      setParcelasAtual(data.transacao.parcelaAtual);
      setReceita(data.transacao.receita);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-red-500">
        Erro: {error.name} - {error.message}
      </p>
    );

  const despesaSchema = z.object({
    data: z.string().min(1, "A data é obrigatória."),
    data_compra: z.string(),
    valor: z.number(),
    categoria: z.number(),
    numero_de_parcelas: z.number(),
    parcela_atual: z.number(),
    meio_de_transacao: z.number(),
    cartao_utilizado: z.number().optional(),
    instituicao_financeira: z.number(),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    fornecedor: z.number().nullable(),
    observacao: z.string().nullable(),
    situacao_fiscal: z.boolean(),
    compra_parcelada: z.boolean(),
    transacao_concluido: z.boolean(),
    excluida: z.boolean(),
    receita: z.boolean(),
  });

  const atualizarDespesa = async () => {
    try {
      despesaSchema.parse({
        data: date instanceof Date ? date.toISOString().split("T")[0] : date,
        data_compra:
          date_compra instanceof Date
            ? date_compra.toISOString().split("T")[0]
            : date_compra,
        valor: parseFloat(valor),
        categoria:
          typeof categoria !== "string"
            ? parseInt(categoria.id)
            : parseInt(categoria),
        numero_de_parcelas,
        parcela_atual,
        meio_de_transacao:
          typeof meio_de_transacao !== "string"
            ? parseInt(meio_de_transacao.id)
            : parseInt(meio_de_transacao),
        cartao_utilizado: cartao_utilizado && parseInt(cartao_utilizado.id),
        instituicao_financeira:
          typeof instituicao_financeira !== "string"
            ? parseInt(instituicao_financeira.id)
            : parseInt(instituicao_financeira),
        descricao,
        fornecedor:
          typeof fornecedor !== "string"
            ? parseInt(fornecedor.id)
            : parseInt(fornecedor),
        observacao,
        situacao_fiscal,
        compra_parcelada,
        transacao_concluido,
        excluida: excluido,
        receita,
      });

      const despesaInput = {
        data: date instanceof Date ? date.toISOString().split("T")[0] : date,
        data_compra:
          date_compra instanceof Date
            ? date_compra.toISOString().split("T")[0]
            : date_compra,
        valor: parseFloat(valor),
        categoria: typeof categoria !== "string" ? categoria.id : categoria,
        numero_de_parcelas,
        parcela_atual,
        meio_de_transacao:
          typeof meio_de_transacao !== "string"
            ? meio_de_transacao.id
            : meio_de_transacao,
        cartao_utilizado: cartao_utilizado && parseInt(cartao_utilizado.id),
        instituicao_financeira:
          typeof instituicao_financeira !== "string"
            ? instituicao_financeira.id
            : instituicao_financeira,
        descricao,
        fornecedor: typeof fornecedor !== "string" ? fornecedor.id : fornecedor,
        observacao,
        situacao_fiscal,
        compra_parcelada,
        transacao_concluido,
        excluida: excluido,
        receita,
      };

      const response = await ApiNovo(
        `financeiro/transacao/${id}/despesa`,
        "PUT",
        despesaInput
      );

      alert("Despesa atualizada com sucesso");
      router.push(`/app/transacoes/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);

      if (error instanceof z.ZodError) {
        setErrors(
          error.issues.reduce(
            (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
            {}
          )
        );
      } else {
        alert("Erro ao atualizar despesa");
      }
    }
  };

  return (
    <Card className="p-4 rounded-lg shadow-md ">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold  mb-2">EDITAR DESPESA {id}</h2>

          <div className="flex gap-4">
            <Label>
              {compra_parcelada ? "DESPESA PARCELADA" : "DESPESA SIMPLES"}
            </Label>
            <Switch
              className=""
              checked={compra_parcelada}
              onCheckedChange={setCompraParcelada}
            />
          </div>
        </CardTitle>
      </CardHeader>

      <div>
        {Object.entries(errors).map(([key, message]) => (
          <p key={key} className="text-red-500">
            {key} - {message}
          </p>
        ))}
      </div>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <Label className="pr-2">Data Pagamento:</Label>
          <DatePickerForm
            descricao={compra_parcelada ? "Data de pagamento" : null}
            setFunc={setDate}
            date={date}
            className={"w-full"}
          />
        </div>
        {compra_parcelada && (
          <div className="flex flex-col gap-1">
            <Label className="pr-2">Data da Compra:</Label>
            <DatePickerForm
              setFunc={setDateCompra}
              className={"w-full"}
              descricao="Data da Compra"
              date={date_compra}
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <Label className="pr-2">Valor:</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="valor">R$</Label>
            <Input
              id="valor"
              type="number"
              placeholder="Valor"
              className={"w-full"}
              value={valor}
              onChange={(e) => setValor(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="pr-2">Meios de Transações:</Label>
          <SelectBase
            setFunc={setMeioTransacao}
            query={MEIO_TRANSACAO_FORM_QUERY}
            dataKey="meiosDeTransacao"
            minutos={60}
            titulo="Meios de Transações"
            className={"w-full"}
            value={meio_de_transacao}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="pr-2">Instituições Financeiras:</Label>
          <SelectBase
            setFunc={setinstituicaoFinanceira}
            query={INSTITUICAO_FINANCEIRA_FORM_QUERY}
            dataKey="instituicoesFinanceiras"
            minutos={60}
            titulo="Instituições Financeiras"
            className={"w-full"}
            value={instituicao_financeira}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="pr-2">Categorias:</Label>
          <SelectBaseBusca
            setFunc={setCategoria}
            query={CATEGORIAS_FORM_QUERY}
            dataKey="categorias"
            minutos={60}
            titulo="Categorias"
            className={"w-full"}
            value={categoria}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="pr-2">Fornecedores:</Label>
          <SelectBaseBusca
            setFunc={setFornecedores}
            query={FORNECEDORES_QUERY}
            dataKey="fornecedores"
            minutos={1}
            titulo="Fornecedores"
            className={"w-full"}
            value={fornecedor}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="pr-2">Cartão Utilizado:</Label>
          <SelectBase
            setFunc={setCartao}
            query={CARTOES_FORM_QUERY}
            dataKey="cartoesDeCredito"
            minutos={60}
            titulo="Cartão Utilizado"
            className={"w-full"}
            value={cartao_utilizado}
          />
        </div>
        {compra_parcelada && (
          <>
            <div className="flex flex-col gap-1">
              <Label className="pr-2">Parcela Atual:</Label>
              <Input
                type="number"
                placeholder="Parcela Atual"
                value={parcela_atual}
                onChange={(e) => setParcelasAtual(parseInt(e.target.value))}
                className={"w-full"}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="pr-2">Número de Parcelas:</Label>
              <Input
                type="number"
                placeholder="Número de Parcelas"
                value={numero_de_parcelas}
                onChange={(e) => setNumParcelas(parseInt(e.target.value))}
                className={"w-full"}
              />
            </div>
          </>
        )}
      </CardContent>

      <CardContent className="flex flex-col items-center gap-2 mt-6">
        <div className="flex flex-col gap-1 w-full">
          <Label className="pr-2">Descrição:</Label>
          <Input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            className={"w-full"}
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <Label className="pr-2">Observação:</Label>
          <Textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Observação"
            className={"w-full"}
          />
        </div>
      </CardContent>

      <CardContent className="flex flex-row gap-4 justify-center items-center mt-6">
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className={`${"w-full"} sm:h-10 w-10`}
            checked={transacao_concluido}
            onCheckedChange={() => setConcluida(!transacao_concluido)}
          />
          <Label>Transação Concluída</Label>
        </div>
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className={`${"w-full"} sm:h-10 w-10`}
            checked={situacao_fiscal}
            onCheckedChange={() => setSituacao_fiscal(!situacao_fiscal)}
          />
          <Label>Nota Fiscal</Label>
        </div>
        <Button onClick={atualizarDespesa}>
          {loading ? <MiniLoading /> : "Atualizar"}
        </Button>
      </CardContent>
    </Card>
  );
}
