"use client";

interface Transacao {
  id: string;
  data: string;
  categoria: {
    id: string;
    nome: string;
  };
  descricao: string;
  fornecedor: {
    id: string;
    nome: string;
  };
  instituicaoFinanceira: {
    id: string;
    nome: string;
  };
  meioDeTransacao: {
    id: number;
    nome: string;
  };
  observacao: string;
  situacaoFiscal: boolean;
  transacaoConcluido: boolean;
  valor: number;
  excluida: boolean;
}

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DatePickerForm } from "../../../../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import client from "../../../../../../../lib/apollo-client";
import {
  CATEGORIAS_FORM_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
  TRANSACAO_RECEITA_QUERY,
} from "@/graphql/query";
import { Checkbox } from "@/components/UI/checkbox";
import { FORNECEDORES_QUERY } from "@/graphql/query";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { z } from "zod";
import { Loading, MiniLoading } from "@/components/loading";

import { useQuery } from "@apollo/client";
import { ApiNovo } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { toast } from "sonner";

export default function EditarReceitaPage() {
  const [instituicao_financeira, setinstituicaoFinanceira] = useState<any>();
  const [categoria, setCategoria] = useState<any>();
  const [meio_de_transacao, setMeioTransacao] = useState<any>();
  const [date, setDate] = React.useState<any>();
  const [transacao_concluido, setConcluida] = useState(true);
  const [fornecedores, setFornecedores] = useState<any>();
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valor, setValor] = useState<any>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { loading, error, data } = useQuery<{ transacao: Transacao }>(
    TRANSACAO_RECEITA_QUERY,
    { variables: { id }, client }
  );
  //Busca de Dados
  useEffect(() => {
    if (!id) return;
    if (data?.transacao) {
      setDate(data.transacao.data);
      setValor(data.transacao.valor);
      setCategoria(data.transacao.categoria);
      setMeioTransacao(data.transacao.meioDeTransacao);
      setinstituicaoFinanceira(data.transacao.instituicaoFinanceira);
      setDescricao(data.transacao.descricao);
      setObservacao(data.transacao.observacao || "");
      setFornecedores(data.transacao.fornecedor);
      setConcluida(data.transacao.transacaoConcluido);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-red-500">
        Erro: {error.name} - {error.message}
      </p>
    );

  const receitaSchema = z.object({
    date: z.string().min(1, "A data é obrigatória."),
    valor: z.number(),
    categoria: z.number().min(1, "A categoria é obrigatória."),
    meio_de_transacao: z.string(),
    instituicao_financeira: z.string(),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    fornecedores: z.number().nullable().optional(),
    observacao: z.string().nullable(),
    transacao_concluido: z.boolean(),
  });

  const editarReceita = async () => {
    try {
      receitaSchema.parse({
        date: date instanceof Date ? date?.toISOString().split("T")[0] : date,
        valor: parseFloat(valor),
        categoria:
          typeof categoria !== "string"
            ? parseInt(categoria.id)
            : parseInt(categoria),
        meio_de_transacao:
          meio_de_transacao?.id ||
          (meio_de_transacao && meio_de_transacao.toString()),
        instituicao_financeira:
          instituicao_financeira?.id || instituicao_financeira.toString(),
        descricao,
        fornecedores: fornecedores
          ? typeof fornecedores !== "string"
            ? parseInt(fornecedores.id)
            : parseInt(fornecedores)
          : null,
        observacao,
        transacao_concluido,
      });

      const receitaInput: ReceitaInput = {
        data: date instanceof Date ? date.toISOString().split("T")[0] : date,
        valor: parseFloat(valor),
        categoria: typeof categoria !== "string" ? categoria.id : categoria,
        meio_de_transacao:
          meio_de_transacao?.id ||
          (meio_de_transacao && meio_de_transacao.toString()),
        instituicao_financeira:
          instituicao_financeira?.id || instituicao_financeira.toString(),
        transacao_concluido,
        descricao,
        observacao,
        fornecedor: fornecedores
          ? typeof fornecedores !== "string"
            ? fornecedores.id
            : fornecedores
          : null,
        receita: true,
      };

      const response = await ApiNovo(
        `financeiro/transacao/${id}/receita`,
        "PUT",
        receitaInput
      );

      toast.success("Receita Atualizada", {
        description: `Receta Atualizada Com Sucesso #${id}`,
        action: {
          label: "Fechar",
          onClick: () => {
            router.push(`/app/transacoes/${id}`);
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.issues.reduce(
            (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
            {}
          )
        );
      } else {
        toast.error("Erro", {
          description: `Erro ao atualizar receita ${error}`,
          action: {
            label: "Fechar",
            onClick: () => {},
          },
        });
      }
    } finally {
    }
  };

  return (
    <Card className="container mx-auto p-6  rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-bold  mb-2">EDITAR RECEITA {id}</h2>
        </CardTitle>
      </CardHeader>

      {Object.entries(errors).map(([key, message]) => (
        <p key={key} className="text-red-500">
          {message}
        </p>
      ))}

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DatePickerForm setFunc={setDate} date={date} className="w-full" />
        <div className="flex items-center gap-2">
          <Label htmlFor="valor">R$</Label>
          <Input
            id="valor"
            type="number"
            value={valor}
            className={"w-full"}
            onChange={(e) => setValor(parseFloat(e.target.value))}
          />
        </div>

        <SelectBase
          setFunc={setMeioTransacao}
          value={meio_de_transacao}
          query={MEIO_TRANSACAO_FORM_QUERY}
          dataKey="meiosDeTransacao"
          minutos={60}
          titulo="Meios de Transações"
          className={"w-full"}
        />
        <SelectBase
          setFunc={setinstituicaoFinanceira}
          value={instituicao_financeira}
          query={INSTITUICAO_FINANCEIRA_FORM_QUERY}
          dataKey="instituicoesFinanceiras"
          minutos={60}
          titulo="Instituições Financeiras"
          className={"w-full"}
        />
        <SelectBaseBusca
          setFunc={setCategoria}
          value={categoria}
          query={CATEGORIAS_FORM_QUERY}
          dataKey="categorias"
          minutos={1}
          titulo="Categorias"
          className={"w-full"}
        />
        <SelectBaseBusca
          setFunc={setFornecedores}
          value={fornecedores}
          query={FORNECEDORES_QUERY}
          dataKey="fornecedores"
          minutos={1}
          titulo="Fornecedores"
          className={"w-full"}
        />
      </CardContent>

      <CardContent className="flex flex-col gap-2 mt-4">
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
      </CardContent>

      <CardContent className="flex justify-center gap-4 mt-12">
        <div className="flex items-center gap-2 h-full">
          <Checkbox
            className={` sm:h-10 w-10`}
            id="terms"
            checked={transacao_concluido}
            onCheckedChange={() => setConcluida(!transacao_concluido)}
          />
          <Label htmlFor="terms">Transação Concluída</Label>
        </div>
        <Button
          className="cursor-pointer flex justify-center items-center"
          onClick={() => editarReceita()}
        >
          {loading ? <MiniLoading /> : ""} Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
}
