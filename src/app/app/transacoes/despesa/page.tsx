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
import { FORNECEDORES_QUERY } from "@/graphql/query";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { z } from "zod";
import { MiniLoading } from "@/components/loading";
import { Switch } from "@/components/UI/switch";
import TransacoesRecentes from "../_components/transacoesRecentes";
import { CALSS_INPUTS } from "@/lib/constantes";

export default function CadastroDespesaPage() {
  const [compra_parcelada, setTipoDespesa] = useState(false);
  const [instituicao_financeira, setInstituicaoFinanceira] = useState<
    number | any
  >();
  const [categoria, setCategoria] = useState<number | any>();
  const [cartao_utilizado, setCartao] = useState<number | any>();
  const [meio_de_transacao, setMeioTransacao] = useState<number | any>();
  const [data, setDate] = useState("");
  const [data_compra, setDateCompra] = useState("");
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
  const router = useRouter();

  const despesaSchema = z.object({
    data: z.string().min(1, "A data é obrigatória."),
    data_compra: z.string(),
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

 

    try {
      despesaSchema.parse({
        data,
        data_compra: data_compra ? data_compra : data,
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
      console.error("Erro na validação ou requisição:", error);
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
    <div className="container mx-auto p-8 bg-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Cadastro de Despesa
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 justify-center">
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cadastro</h2>
          <div>
            {Object.entries(errors).map(([key, message]) => (
              <p key={key} className="text-red-500">
                {message}
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
              className={CALSS_INPUTS}
            />
            {compra_parcelada ? (
              <DatePickerForm
                setFunc={setDateCompra}
                className={CALSS_INPUTS}
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
                className={CALSS_INPUTS}
                onChange={(e) => setValor(parseFloat(e.target.value))}
              />
            </div>
            <SelectBase
              setFunc={setMeioTransacao}
              query={MEIO_TRANSACAO_FORM_QUERY}
              dataKey="meiosDeTransacao"
              minutos={60}
              titulo="Meios de Transações"
              className={CALSS_INPUTS}
            />
            <SelectBase
              setFunc={setInstituicaoFinanceira}
              query={INSTITUICAO_FINANCEIRA_FORM_QUERY}
              dataKey="instituicoesFinanceiras"
              minutos={60}
              titulo="Instituições Financeiras"
              className={CALSS_INPUTS}
            />
            <SelectBaseBusca
              setFunc={setCategoria}
              query={CATEGORIAS_FORM_QUERY}
              dataKey="categorias"
              minutos={60}
              titulo="Categorias"
              className={CALSS_INPUTS}
            />
            <SelectBaseBusca
              setFunc={setFornecedores}
              query={FORNECEDORES_QUERY}
              dataKey="fornecedores"
              minutos={1}
              titulo="Fornecedores"
              className={CALSS_INPUTS}
            />
            <SelectBase
              setFunc={setCartao}
              query={CARTOES_FORM_QUERY}
              dataKey="cartoesDeCredito"
              minutos={60}
              titulo="Cartão Utilizado"
              className={CALSS_INPUTS}
            />
            {compra_parcelada ? (
              <>
                <Input
                  type="number"
                  placeholder="Parcela Atual"
                  onChange={(e) => setParcelas(parseInt(e.target.value))}
                  className={CALSS_INPUTS}
                />
                <Input
                  type="number"
                  placeholder="Número de Parcelas"
                  onChange={(e) => setNumParcelas(parseInt(e.target.value))}
                  className={CALSS_INPUTS}
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
              className={CALSS_INPUTS}
            />

            <Textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Observação"
              className={CALSS_INPUTS}
            />
          </div>
          <div className="flex flex-row gap-4 justify-center items-center mt-6">
            <div className="flex items-center gap-2 h-full">
              <Checkbox
                className={`${CALSS_INPUTS} sm:h-10 w-10`}
                id="terms"
                checked={transacao_concluido}
                onCheckedChange={() => setConcluida(!transacao_concluido)}
              />
              <Label htmlFor="terms">Transação Concluída</Label>
            </div>
            <div className="flex items-center gap-2 h-full">
              <Checkbox
                className={`${CALSS_INPUTS} sm:h-10 w-10`}
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

        <TransacoesRecentes
          receita={false}
          query={DESPESA_LIST_QUERY}
          dataKey="despesas"
        />
      </div>
    </div>
  );
}
