"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DatePickerForm } from "../../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import {
  CARTOES_FORM_QUERY,
  CATEGORIAS_FORM_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
} from "@/graphql/query";
import { Checkbox } from "@/components/UI/checkbox";
import { FORNECEDORES_QUERY } from "@/graphql/query";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { z } from "zod";
import { MiniLoading } from "@/components/loading";
import { Switch } from "@/components/UI/switch";
import { CALSS_INPUTS } from "@/lib/constantes";
import SelectArquivo from "../../_components/SelectArquivo";

export default function CadastroDespesaPage() {
  const [compra_parcelada, setTipoDespesa] = useState(false);
  const [instituicao_financeira, setInstituicaoFinanceira] = useState<
    number | any
  >();
  const [categoria, setCategoria] = useState<number | any>();
  const [cartao_utilizado, setCartao] = useState<number | any>();
  const [meio_de_transacao, setMeioTransacao] = useState<number | any>();
  const [date, setDate] = React.useState<any>();
  const [date_compra, setDate_compra] = React.useState<any>();
  const [transacao_concluido, setConcluida] = useState(true);
  const [fornecedor, setFornecedores] = useState<number | any>();
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valor, setValor] = useState<number | any>();
  const [parcela_atual, setParcelas] = useState<number | any>(1);
  const [numero_de_parcelas, setNumParcelas] = useState<number | any>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [situacao_fiscal, setSituacao_fiscal] = useState(true);
  const [loading, setLoading] = useState(false);

  const [listaArquivos, setListaArquivos] = useState<ArquivoApi[]>([]);

  const router = useRouter();

  const despesaSchema = z.object({
    date: z.string().min(1, "A data é obrigatória."),
    data_compra: z.string().nullable().optional(),
    valor: z.number(),
    categoria: z.number(),
    numero_de_parcelas: z.number(),
    parcela_atual: z.number(),
    meio_de_transacao: z.number(),
    cartao_utilizado: z.number().nullable(),
    instituicao_financeira: z.number(),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    fornecedor: z.number().nullable(),
    observacao: z.string().nullable(),
    situacao_fiscal: z.boolean(),
    compra_parcelada: z.boolean(),
    transacao_concluido: z.boolean(),
  });

  const cadastrarDespesa = async () => {
    setLoading(true);
    console.log({
      date,
      date_compra,
      valor,
      categoria,
      numero_de_parcelas,
      parcela_atual,
      meio_de_transacao,
      cartao_utilizado,
      instituicao_financeira,
      descricao,
      fornecedor,
      observacao,
      situacao_fiscal,
      compra_parcelada,
      transacao_concluido,
    });
    try {
      const dataCompraFormatada =
        date_compra && date_compra !== "undefined"
          ? new Date(date_compra).toISOString().split("T")[0]
          : null;

      despesaSchema.parse({
        date: date.toISOString().split("T")[0],
        date_compra: dataCompraFormatada,
        valor,
        categoria: parseInt(categoria),
        numero_de_parcelas: numero_de_parcelas ? numero_de_parcelas : 1,
        parcela_atual: parcela_atual ? parcela_atual : 1,
        meio_de_transacao: parseInt(meio_de_transacao),
        cartao_utilizado: cartao_utilizado ? parseInt(cartao_utilizado) : null,
        instituicao_financeira: parseInt(instituicao_financeira),
        descricao,
        fornecedor: fornecedor ? parseInt(fornecedor) : null,
        observacao: observacao ? observacao : null,
        situacao_fiscal,
        compra_parcelada,
        transacao_concluido,
      });

      const despesaInput: DespesaInput = {
        data: date ? date.toISOString().split("T")[0] : "",
        data_compra: date_compra
          ? date_compra.toISOString().split("T")[0]
          : date.toISOString().split("T")[0],
        valor,
        categoria,
        numero_de_parcelas,
        parcela_atual,
        meio_de_transacao,
        cartao_utilizado,
        instituicao_financeira,
        descricao,
        fornecedor,
        observacao,
        situacao_fiscal,
        compra_parcelada,
        transacao_concluido,
        receita: false,
      };

      console.log(despesaInput);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financeiro/transacao/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(despesaInput),
        }
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Despesa cadastrada");
      setLoading(false);
      router.push("/app/transacoes/despesa/");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.error("Erro na validação ou requisição:", error);
      if (error instanceof z.ZodError) {
        setErrors(
          error.issues.reduce(
            (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
            {}
          )
        );
      } else {
        alert(`Erro ao cadastrar despesa - ${error}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 rounded-lg shadow-md ">
      <h2 className="text-xl font-bold  mb-2">Despesa</h2>
      <div>
        {Object.entries(errors).map(([key, message]) => (
          <p key={key} className="text-red-500">
            {key} - {message}
          </p>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Label>Despesa Simples</Label>
        <Switch
          className=""
          checked={compra_parcelada}
          onCheckedChange={setTipoDespesa}
        />
        <Label>Despesa Parcelada</Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DatePickerForm
          descricao={compra_parcelada ? "Data de pagamento" : null}
          setFunc={setDate}
          className={"w-full"}
          date={date}
        />
        {compra_parcelada ? (
          <DatePickerForm
            setFunc={setDate_compra}
            className={"w-full"}
            descricao="Data da Compra"
            date={date_compra}
          />
        ) : (
          ""
        )}

        <div className="flex items-center gap-2">
          <Label htmlFor="valor">R$</Label>
          <Input
            id="valor"
            type="number"
            placeholder="Valor"
            className={"w-full"}
            onChange={(e) => setValor(parseFloat(e.target.value))}
          />
        </div>
        <SelectBase
          setFunc={setMeioTransacao}
          query={MEIO_TRANSACAO_FORM_QUERY}
          dataKey="meiosDeTransacao"
          minutos={60}
          titulo="Meios de Transações"
          className={"w-full"}
          value={meio_de_transacao}
        />
        <SelectBase
          setFunc={setInstituicaoFinanceira}
          query={INSTITUICAO_FINANCEIRA_FORM_QUERY}
          dataKey="instituicoesFinanceiras"
          minutos={60}
          titulo="Instituições Financeiras"
          className={"w-full"}
          value={instituicao_financeira}
        />
        <SelectBaseBusca
          setFunc={setCategoria}
          query={CATEGORIAS_FORM_QUERY}
          dataKey="categorias"
          minutos={60}
          titulo="Categorias"
          className={"w-full"}
          value={categoria}
        />
        <SelectBaseBusca
          setFunc={setFornecedores}
          query={FORNECEDORES_QUERY}
          dataKey="fornecedores"
          minutos={1}
          titulo="Fornecedores"
          className={"w-full"}
          value={fornecedor}
        />
        <SelectBase
          setFunc={setCartao}
          query={CARTOES_FORM_QUERY}
          dataKey="cartoesDeCredito"
          minutos={60}
          titulo="Cartão Utilizado"
          className={"w-full"}
          value={cartao_utilizado}
        />
        {compra_parcelada ? (
          <>
            <Input
              type="number"
              placeholder="Parcela Atual"
              onChange={(e) => setParcelas(parseInt(e.target.value))}
              className={"w-full"}
            />
            <Input
              type="number"
              placeholder="Número de Parcelas"
              onChange={(e) => setNumParcelas(parseInt(e.target.value))}
              className={"w-full"}
            />
          </>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col items-center gap-2 mt-6">
        <Input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          className={"w-full"}
        />

        <Textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Observação"
          className={"w-full"}
        />
      </div>

      <SelectArquivo setListaArquivos={setListaArquivos} listaArquivos={listaArquivos} />

      <div className="flex flex-row gap-4 justify-center items-center mt-6">
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className={` sm:h-10 w-10`}
            id="terms"
            checked={transacao_concluido}
            onCheckedChange={() => setConcluida(!transacao_concluido)}
          />
          <Label htmlFor="terms">Transação Concluída</Label>
        </div>
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className={`${"w-full"} sm:h-10 w-10`}
            id="terms"
            checked={situacao_fiscal}
            onCheckedChange={() => setSituacao_fiscal(!situacao_fiscal)}
          />
          <Label htmlFor="terms">Nota Fiscal</Label>
        </div>
        <Button className="" onClick={cadastrarDespesa}>
          {loading ? <MiniLoading /> : "Cadastrar"}
        </Button>
      </div>
    </div>
  );
}
