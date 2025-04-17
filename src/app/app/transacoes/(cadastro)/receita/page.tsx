"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import {
  CATEGORIAS_FORM_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
  TIPO_ARQUIVO_QUERY,
} from "@/graphql/query";
import { Checkbox } from "@/components/UI/checkbox";
import { FORNECEDORES_QUERY } from "@/graphql/query";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { z } from "zod";
import { MiniLoading } from "@/components/loading";
import { DatePickerForm } from "@/components/form/datePickerForm";
import { File } from "lucide-react";
import SelectArquivo from "../../_components/SelectArquivo";

export default function CadastroReceitaPage() {
  const [instituicao_financeira, setinstituicaoFinanceira] = useState<
    number | any
  >();
  const [categoria, setCategoria] = useState<number | any>();
  const [meio_de_transacao, setMeioTransacao] = useState<number | any>();
  const [date, setDate] = React.useState<any>();
  const [transacao_concluido, setConcluida] = useState(true);
  const [fornecedores, setFornecedores] = useState<number | any>();
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valor, setValor] = useState<number | any>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [tipoArquivo, setTipoArquivo] = useState<any>();
  const router = useRouter();

  const receitaSchema = z.object({
    date: z.string().min(1, "A data é obrigatória."),
    valor: z.number(),
    categoria: z.number().min(1, "A categoria é obrigatória."),
    meio_de_transacao: z.number().min(1, "O meio de transação é obrigatório."),
    instituicao_financeira: z
      .number()
      .min(1, "A instituição financeira é obrigatória."),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    fornecedores: z.number().nullable(),
    observacao: z.string().nullable(),
    transacao_concluido: z.boolean(),
  });

  const cadastrarReceita = async () => {
    setLoading(true);

    try {
      receitaSchema.parse({
        date: date.toISOString().split("T")[0],
        valor,
        categoria: parseInt(categoria),
        meio_de_transacao: parseInt(meio_de_transacao),
        instituicao_financeira: parseInt(instituicao_financeira),
        descricao,
        fornecedores: parseInt(fornecedores),
        observacao,
        transacao_concluido,
      });

      const receitaInput: ReceitaInput = {
        data: date ? date.toISOString().split("T")[0] : "null",
        valor,
        categoria,
        meio_de_transacao,
        instituicao_financeira,
        transacao_concluido,
        descricao,
        observacao,
        fornecedor: fornecedores,
        receita: true,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financeiro/transacao/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(receitaInput),
        }
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Receita cadastrada");
      setLoading(false);
      router.push("/app/transacoes/receita/");
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
        alert("Erro ao cadastrar receita");
      }
    }
  };
  return (
    <div className="w-full p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold  mb-2">Receita</h2>
      <div>
        {Object.entries(errors).map(([key, message]) => (
          <p key={key} className="text-red-500">
            {message}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-6">
        <DatePickerForm
          setFunc={setDate}
          date={date}
          className="w-full bg-transparent"
        />

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
          value={categoria?.toString()}
          query={MEIO_TRANSACAO_FORM_QUERY}
          dataKey="meiosDeTransacao"
          minutos={60}
          titulo="Meios de Transações"
          className={"w-full"}
        />
        <SelectBase
          setFunc={setinstituicaoFinanceira}
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
          minutos={1}
          titulo="Categorias"
          className={"w-full bg-transparent"}
          value={categoria}
        />
        <SelectBaseBusca
          setFunc={setFornecedores}
          query={FORNECEDORES_QUERY}
          dataKey="fornecedores"
          minutos={1}
          titulo="Fornecedores"
          className={"w-full bg-transparent"}
          value={fornecedores}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          className={"w-full "}
        />

        <Textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Observação"
          className={"w-full"}
        />
      </div>

      <SelectArquivo />

      <div className="flex justify-center gap-4 mt-12">
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className={`sm:h-10 w-10`}
            id="terms"
            checked={transacao_concluido}
            onCheckedChange={() => setConcluida(!transacao_concluido)}
          />
          <Label htmlFor="terms">Transação Concluída</Label>
        </div>
        <Button
          className="cursor-pointer flex justify-center items-center"
          onClick={() => cadastrarReceita()}
        >
          {loading ? <MiniLoading /> : ""} Cadastrar
        </Button>
      </div>
    </div>
  );
}
