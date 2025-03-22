"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DatePickerForm } from "../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import {
  CATEGORIAS_FORM_QUERY,
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

export default function CadastroReceitaPage() {
  const [instituicao_financeira, setinstituicaoFinanceira] = useState("");
  const [categoria, setCategoria] = useState("");
  const [meio_de_transacao, setMeioTransacao] = useState("");
  const [date, setDate] = useState("");
  const [concluida, setConcluida] = useState(true);
  const [fornecedores, setFornecedores] = useState("");
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valor, setValor] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const receitaSchema = z.object({
    date: z.string().min(1, "A data é obrigatória."),
    valor: z.number(),
    categoria: z.string().min(1, "A categoria é obrigatória."),
    meio_de_transacao: z.string().min(1, "O meio de transação é obrigatório."),
    instituicao_financeira: z
      .string()
      .min(1, "A instituição financeira é obrigatória."),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    fornecedores: z.string().nullable(),
    observacao: z.string().nullable(),
    concluida: z.boolean(),
  });

  const cadastrarReceita = async () => {
    setLoading(true);
    try {
      receitaSchema.parse({
        date,
        valor,
        categoria,
        meio_de_transacao,
        instituicao_financeira,
        descricao,
        fornecedores,
        observacao,
        concluida,
      });

      const receitaInput: ReceitaInput = {
        data: date ? date : "null",
        valor,
        categoria,
        meio_de_transacao,
        instituicao_financeira,
        transacaoConcluida: concluida,
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
      window.location.reload()
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
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Cadastro de Receita
      </h1>
      <div>
        {errors.data && <p className="text-red-500">{errors.data}</p>}

        {errors.valor && <p className="text-red-500">{errors.valor}</p>}
        {errors.categoria && <p className="text-red-500">{errors.categoria}</p>}
        {errors.meio_de_transacao && (
          <p className="text-red-500">{errors.meio_de_transacao}</p>
        )}
        {errors.instituicao_financeira && (
          <p className="text-red-500">{errors.instituicao_financeira}</p>
        )}
        {errors.transacaoConcluida && (
          <p className="text-red-500">{errors.transacaoConcluida}</p>
        )}
        {errors.descricao && <p className="text-red-500">{errors.descricao}</p>}
        {errors.observacao && (
          <p className="text-red-500">{errors.observacao}</p>
        )}
        {errors.fornecedor && (
          <p className="text-red-500">{errors.fornecedor}</p>
        )}
        {errors.receita && <p className="text-red-500">{errors.receita}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DatePickerForm setFunc={setDate} className="w-full" />

        <div className="flex items-center gap-2">
          <Label 
          htmlFor="valor"
          >R$</Label>
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
          setFunc={setinstituicaoFinanceira}
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
          minutos={1}
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
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className="h-full sm:h-10 w-10"
            id="terms"
            checked={concluida}
            onCheckedChange={() => setConcluida(!concluida)}
          />
          <Label htmlFor="terms">Transação Concluída</Label>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
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
      <div className="flex justify-center gap-4 mt-12">
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
