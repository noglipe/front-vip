"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { z } from "zod";

import { DatePickerForm } from "../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import { Checkbox } from "@/components/UI/checkbox";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { MiniLoading } from "@/components/loading";
import { Switch } from "@/components/UI/switch";
import { CALSS_INPUTS } from "@/lib/constantes";

import {
  CARTOES_FORM_QUERY,
  CATEGORIAS_FORM_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
} from "@/graphql/query";
import { FORNECEDORES_QUERY } from "@/graphql/fornecedores-query";
import { DESPESA_QUERY } from "@/graphql/despesa-query"; // Criar essa query para buscar os dados da despesa

export default function EditarDespesaPage() {
  const router = useRouter();
  const params = useParams();
  const despesaId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [despesa, setDespesa] = useState({
    data: "",
    data_compra: "",
    valor: 0,
    categoria: null,
    numero_de_parcelas: 1,
    parcela_atual: 1,
    meio_de_transacao: null,
    cartao_utilizado: null,
    instituicao_financeira: null,
    descricao: "",
    fornecedor: null,
    observacao: "",
    situacao_fiscal: true,
    compra_parcelada: false,
    transacao_concluido: true,
  });

  // Busca os dados da despesa
  const { data, error } = useQuery(DESPESA_QUERY, {
    variables: { id: despesaId },
  });

  useEffect(() => {
    if (data && data.despesa) {
      setDespesa(data.despesa);
      setLoading(false);
    }
  }, [data]);

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

  const salvarEdicao = async () => {
    setSaving(true);
    try {
      despesaSchema.parse(despesa);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financeiro/transacao/${despesaId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(despesa),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar despesa.");

      alert("Despesa atualizada com sucesso!");
      router.push("/app/transacoes/despesa/");
    } catch (error) {
      console.error("Erro na validação ou requisição:", error);
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
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="container mx-auto p-8 bg-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Editar Despesa
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-center">
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edição</h2>

          {Object.entries(errors).map(([key, message]) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}

          <div className="flex gap-4 mb-4">
            <Label>Despesa Simples</Label>
            <Switch
              checked={despesa.compra_parcelada}
              onCheckedChange={(val) =>
                setDespesa({ ...despesa, compra_parcelada: val })
              }
            />
            <Label>Despesa Parcelada</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DatePickerForm
              setFunc={(valor) => setDespesa({ ...despesa, data: valor })}
              className={CALSS_INPUTS}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={despesa.valor}
              onChange={(e) =>
                setDespesa({ ...despesa, valor: parseFloat(e.target.value) })
              }
              className={CALSS_INPUTS}
            />
            <SelectBase
              setFunc={(val) =>
                setDespesa({ ...despesa, meio_de_transacao: val })
              }
              query={MEIO_TRANSACAO_FORM_QUERY}
              dataKey="meiosDeTransacao"
              className={CALSS_INPUTS}
            />
          </div>

          <Input
            type="text"
            value={despesa.descricao}
            onChange={(e) =>
              setDespesa({ ...despesa, descricao: e.target.value })
            }
            placeholder="Descrição"
            className={CALSS_INPUTS}
          />

          <div className="flex flex-row gap-4 justify-center items-center mt-6">
            <Checkbox
              checked={despesa.transacao_concluido}
              onCheckedChange={() =>
                setDespesa({
                  ...despesa,
                  transacao_concluido: !despesa.transacao_concluido,
                })
              }
            />
            <Label>Transação Concluída</Label>

            <Button onClick={salvarEdicao}>
              {saving ? <MiniLoading /> : "Salvar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
