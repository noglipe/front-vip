"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DatePickerForm } from "../../../../../../components/form/datePickerForm";
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
import SelectArquivo from "../../_components/SelectArquivo";
import { ApiNovo } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { NotebookTabs } from "lucide-react";
import { toast } from "sonner";

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

  const enviarArquivoParaBackend = async (
    arquivo: File,
    tipo: any,
    index: number,
    IdT: string,
    ids?: number[] | null
  ) => {
    const formData = new FormData();
    formData.append("file", arquivo);
    try {
      const response = await ApiNovo(
        "financeiro/arquivo/upload/",
        "POST",
        formData
      );

      const data = await response.json();

      if (response.ok) {
        // Atualiza a lista com os dados do back
        setListaArquivos((prev) => {
          const atualizada = [...prev];
          atualizada[index] = {
            ...atualizada[index],
            caminho: data.caminho,
            nome: data.nome,
          };
          return atualizada;
        });

        let bodyArquivo: any;

        if (ids) {
          bodyArquivo = {
            caminho: data.caminho,
            nome: data.nome,
            tipo_id: tipo.id,
            transacao_id: IdT,
            ids_transacao: ids,
          };
        } else {
          bodyArquivo = {
            caminho: data.caminho,
            nome: data.nome,
            tipo_id: tipo.id,
            transacao_id: IdT,
          };
        }

        const salvarResponse = await ApiNovo(
          "financeiro/arquivos/",
          "POST",
          bodyArquivo
        );

        const salvarData = await salvarResponse.json();

        if (!salvarResponse.ok) {
          toast.error("Error", {
            description: `Erro ao salvar arquivo no banco ${salvarData}`,
            action: {
              label: "Fechar",
              onClick: () => {},
            },
          });
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: `Erro de conexão ${error}`,
        action: {
          label: "Fechar",
          onClick: () => {},
        },
      });
    }
  };

  function enviarArquivo(IdT: string, ids?: number[] | null) {
    listaArquivos &&
      listaArquivos.forEach((item, index) => {
        enviarArquivoParaBackend(item.arquivo, item.tipo, index, IdT, ids);
      });
  }

  const despesaSchema = z.object({
    date: z.string().min(1, "A data é obrigatória."),
    data_compra: z.string().nullable().optional(),
    valor: z.number(),
    categoria: z.number(),
    numero_de_parcelas: z.number(),
    parcela_atual: z.number(),
    meio_de_transacao: z.string(),
    cartao_utilizado: z.string().nullable(),
    instituicao_financeira: z.string(),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    fornecedor: z.string().nullable(),
    observacao: z.string().nullable(),
    situacao_fiscal: z.boolean(),
    compra_parcelada: z.boolean(),
    transacao_concluido: z.boolean(),
  });

  const cadastrarDespesa = async () => {
    setLoading(true);
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
        meio_de_transacao:
          meio_de_transacao?.id ||
          (meio_de_transacao && meio_de_transacao.toString()) ||
          null,
        cartao_utilizado:
          cartao_utilizado?.id ||
          (cartao_utilizado && cartao_utilizado.toString()) ||
          null,
        instituicao_financeira:
          instituicao_financeira?.id ||
          instituicao_financeira.toString() ||
          null,
        descricao,
        fornecedor: String(fornecedor),
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
        meio_de_transacao:
          meio_de_transacao?.id ||
          (meio_de_transacao && meio_de_transacao.toString()) ||
          null,
        cartao_utilizado:
          cartao_utilizado?.id ||
          (cartao_utilizado && cartao_utilizado.toString()) ||
          null,
        instituicao_financeira:
          instituicao_financeira?.id ||
          instituicao_financeira.toString() ||
          null,
        descricao,
        fornecedor: String(fornecedor),
        observacao,
        situacao_fiscal,
        compra_parcelada,
        transacao_concluido,
        receita: false,
      };

      console.log(despesaInput);
      const response = await ApiNovo(
        `financeiro/transacao/despesa/`,
        "POST",
        despesaInput
      );

      const data = await response.json();

      if (data.ids) {
        enviarArquivo(data.id, data.ids);
      } else {
        enviarArquivo(data.id);
      }
      setLoading(false);
      toast.success("DESPESA CADASTRADA", {
        description: `Despesa Cadastrada com sucesso `,
        action: {
          label: "Fechar",
          onClick: () => {
            window.location.reload();
          },
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error("ERRO", {
        description: `Erro na validação ou requisição ${error} `,
        action: {
          label: "Fechar",
          onClick: () => {},
        },
      });

      if (error instanceof z.ZodError) {
        setErrors(
          error.issues.reduce(
            (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
            {}
          )
        );
      } else {
        toast.error("ERRO", {
          description: `Erro ao cadastrar despesa ${error} `,
          action: {
            label: "Fechar",
            onClick: () => {},
          },
        });
      }
    } finally {
      window.location.reload();
    }
  };

  return (
    <Card className="w-full p-4 shadow-md ">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <h1 className="flex flex-row items-center">
            <NotebookTabs />
            CADASTRO DE DESPESA
          </h1>

          <div className="flex gap-4">
            <Label>
              {compra_parcelada ? "DESPESA PARCELADA" : "DESPESA SIMPLES"}
            </Label>
            <Switch
              className=""
              checked={compra_parcelada}
              onCheckedChange={setTipoDespesa}
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

      <CardContent className="grid sm:grid-cols-3 grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <Label className="pr-2">Data Pagamento:</Label>
          <DatePickerForm
            descricao={compra_parcelada ? "Data de pagamento" : null}
            setFunc={setDate}
            className={"w-full"}
            date={date}
          />
        </div>
        {compra_parcelada && (
          <div className="flex flex-col gap-1">
            <Label className="pr-2">Data da Compra:</Label>
            <DatePickerForm
              setFunc={setDate_compra}
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
            setFunc={setInstituicaoFinanceira}
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
                onChange={(e) => setParcelas(parseInt(e.target.value))}
                className={"w-full"}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="pr-2">Número de Parcelas:</Label>
              <Input
                type="number"
                placeholder="Número de Parcelas"
                onChange={(e) => setNumParcelas(parseInt(e.target.value))}
                className={"w-full"}
              />
            </div>
          </>
        )}
      </CardContent>
      <CardContent className="flex flex-col items-center gap-2 ">
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

      <SelectArquivo
        setListaArquivos={setListaArquivos}
        listaArquivos={listaArquivos}
      />

      <CardContent className="flex flex-row gap-4 justify-center items-center">
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
      </CardContent>
    </Card>
  );
}
