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
} from "@/graphql/query";
import { Checkbox } from "@/components/UI/checkbox";
import { FORNECEDORES_QUERY } from "@/graphql/query";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { z } from "zod";
import { MiniLoading } from "@/components/loading";
import { DatePickerForm } from "@/components/form/datePickerForm";
import { ApiNovo } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { NotebookTabs } from "lucide-react";
import { toast } from "sonner";

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
  const router = useRouter();

  const receitaSchema = z.object({
    date: z.string().min(1, "A data é obrigatória."),
    valor: z.number(),
    categoria: z.number().min(1, "A categoria é obrigatória."),
    meio_de_transacao: z.string(),
    instituicao_financeira: z.string(),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    fornecedores: z.number().nullable().optional(),
    observacao: z.string().nullable().optional(),
    transacao_concluido: z.boolean(),
  });

  const cadastrarReceita = async () => {
    setLoading(true);

    try {
      receitaSchema.parse({
        date: date.toISOString().split("T")[0],
        valor,
        categoria: parseInt(categoria),
        meio_de_transacao:
          meio_de_transacao?.id ||
          (meio_de_transacao && meio_de_transacao.toString()),
        instituicao_financeira:
          instituicao_financeira?.id ||
          instituicao_financeira.toString(),
        descricao,
        fornecedores: fornecedores ? parseInt(fornecedores) : null,
        observacao,
        transacao_concluido,
      });

      const receitaInput: ReceitaInput = {
        data: date ? date.toISOString().split("T")[0] : "null",
        valor,
        categoria,
        meio_de_transacao:
          meio_de_transacao?.id ||
          (meio_de_transacao && meio_de_transacao.toString()) ||
          null,
        instituicao_financeira:
          instituicao_financeira?.id ||
          instituicao_financeira.toString() ||
          null,
        transacao_concluido,
        descricao,
        observacao,
        fornecedor: fornecedores ? fornecedores : null,
        receita: true,
      };

      await ApiNovo(`financeiro/transacao/receita/`, "POST", receitaInput);

      setLoading(false);
      toast.success("Receita cadastrada", {
        description: `Receta Cadastrada Com Sucesso`,
        action: {
          label: "Fechar",
          onClick: () => {
            window.location.reload();
          },
        },
      });
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
    <Card className="w-full p-4 shadow-md">
      <CardHeader>
        <CardTitle>
          <h1 className="flex flex-row items-center">
            <NotebookTabs />
            CADASTRO DE RECEITA
          </h1>
        </CardTitle>
      </CardHeader>

      <div>
        {Object.entries(errors).map(([key, message]) => (
          <p key={key} className="text-red-500">
            {message}
          </p>
        ))}
      </div>

      <CardContent className="grid sm:grid-cols-3 grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <Label className="pr-2">Data:</Label>
          <DatePickerForm
            setFunc={setDate}
            date={date}
            className="w-full bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="pr-2">Valor:</Label>
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
        </div>

        <div className="flex flex-col gap-1">
          <Label className="pr-2">Meios de Transações:</Label>
          <SelectBase
            setFunc={setMeioTransacao}
            value={meio_de_transacao}
            query={MEIO_TRANSACAO_FORM_QUERY}
            dataKey="meiosDeTransacao"
            minutos={60}
            titulo="Meios de Transações"
            className={"w-full"}
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
            minutos={1}
            titulo="Categorias"
            className={"w-full bg-transparent"}
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
            className={"w-full bg-transparent"}
            value={fornecedores}
          />
        </div>
      </CardContent>

      <CardContent className="flex flex-col gap-2 ">
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

      <CardContent className="flex justify-center gap-4 ">
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
      </CardContent>
    </Card>
  );
}
