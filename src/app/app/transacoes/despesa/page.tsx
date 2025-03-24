"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DatePickerForm } from "../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import {
  CARTOES_FORM_QUERY,
  CATEGORIAS_FORM_QUERY,
  DESPESA_LIST_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
} from "@/graphql/query";
import { Checkbox } from "@/components/UI/checkbox";
import { FORNECEDORES_QUERY } from "@/graphql/fornecedores-query";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { z } from "zod";
import { Loading, MiniLoading } from "@/components/loading";
import { Switch } from "@/components/UI/switch";
import TransacoesRecentes from "../_components/transacoesRecentes";

export default function CadastroDespesaPage() {
  const [compra_parcelada, setTipoDespesa] = useState(false);
  const [instituicao_financeira, setInstituicaoFinanceira] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cartao_utilizado, setCartao] = useState("");
  const [meio_de_transacao, setMeioTransacao] = useState("");
  const [data, setDate] = useState("");
  const [data_compra, setDateCompra] = useState("");
  const [transacao_concluido, setConcluida] = useState(true);
  const [fornecedor, setFornecedores] = useState("");
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valor, setValor] = useState(0);
  const [parcela_atual, setParcelas] = useState(1);
  const [numero_de_parcelas, setNumParcelas] = useState(1);
  const [errors, setErrors] = useState({});
  const [situacao_fiscal, setSituacao_fiscal] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const despesaSchema = z.object({
    date: z.string().min(1, "A data é obrigatória."),
    data_compra: z.string(),
    valor: z.number(),
    categoria: z.number().min(1, "A categoria é obrigatória."),
    numero_de_parcelas: z.number().nullable(),
    parcela_atual: z.number().nullable(),
    meio_de_transacao: z.number().min(1, "O meio de transação é obrigatório."),
    cartao_utilizado: z.number().nullable(),
    instituicao_financeira: z
      .number()
      .min(1, "A instituição financeira é obrigatória."),
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
      data,
      data_compra: data_compra ? data_compra : null,
      valor,
      categoria,
      numero_de_parcelas: numero_de_parcelas,
      parcela_atual: parcela_atual,
      meio_de_transacao,
      cartao_utilizado,
      instituicao_financeira,
      descricao,
      fornecedor,
      observacao : observacao ? observacao : null,
      situacao_fiscal,
      compra_parcelada,
      transacao_concluido,
    });
    try {
      despesaSchema.parse({
        data,
        data_compra,
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

      const despesaInput: DespesaInput = {
        data,
        data_compra: data_compra ? data_compra : "",
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
      if (error instanceof z.ZodError) {
        setErrors(
          error.issues.reduce(
            (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
            {}
          )
        );
      } else {
        alert("Erro ao cadastrar despesa");
      }
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Cadastro de Despesa
      </h1>
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
          className="w-full"
        />
        {compra_parcelada ? (
          <DatePickerForm
            setFunc={setDateCompra}
            className="w-full"
            descricao="Data da Compra"
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
            className="w-full"
            onChange={(e) => setValor(parseFloat(e.target.value))}
          />
        </div>
        <SelectBase
          setFunc={setMeioTransacao}
          query={MEIO_TRANSACAO_FORM_QUERY}
          dataKey="meiosDeTransacao"
          minutos={60}
          titulo="Meios de Transações"
          className="w-full"
        />
        <SelectBase
          setFunc={setInstituicaoFinanceira}
          query={INSTITUICAO_FINANCEIRA_FORM_QUERY}
          dataKey="instituicoesFinanceiras"
          minutos={60}
          titulo="Instituições Financeiras"
          className="w-full"
        />
        <SelectBaseBusca
          setFunc={setCategoria}
          query={CATEGORIAS_FORM_QUERY}
          dataKey="categorias"
          minutos={60}
          titulo="Categorias"
          className="w-full"
        />
        <SelectBaseBusca
          setFunc={setFornecedores}
          query={FORNECEDORES_QUERY}
          dataKey="fornecedores"
          minutos={1}
          titulo="Fornecedores"
          className="w-full"
        />
        <SelectBase
          setFunc={setCartao}
          query={CARTOES_FORM_QUERY}
          dataKey="cartoesDeCredito"
          minutos={60}
          titulo="Cartão Utilizado"
          className="w-full"
        />
        {compra_parcelada ? (
          <>
            <Input
              type="number"
              placeholder="Parcela Atual"
              onChange={(e) => setParcelas(parseInt(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Número de Parcelas"
              onChange={(e) => setNumParcelas(parseInt(e.target.value))}
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
          className="w-full"
        />

        <Textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Observação"
          className="w-full"
        />
      </div>
      <div className="flex flex-row gap-4 justify-center items-center mt-6">
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className="h-full sm:h-10 w-10"
            id="terms"
            checked={transacao_concluido}
            onCheckedChange={() => setConcluida(!transacao_concluido)}
          />
          <Label htmlFor="terms">Transação Concluída</Label>
        </div>
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className="h-full sm:h-10 w-10"
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

       <TransacoesRecentes receita={false} query={DESPESA_LIST_QUERY} />
    </div>
  );
}
