"use client";

import SelectArquivo from "@/app/app/(admin)/transacoes/_components/SelectArquivo";
import { DatePickerForm } from "@/components/form/datePickerForm";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Textarea } from "@/components/UI/textarea";
import {
  CARTOES_FORM_QUERY,
  CATEGORIAS_FORM_ENTRADA_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
} from "@/graphql/query";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApiNovo } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormularioCompra() {
  const [parcelada, setParcelada] = useState(false);
  const [date, setDate] = useState<Date | any>(new Date());
  const [listaArquivos, setListaArquivos] = useState<ArquivoApi[]>([]);
  const router = useRouter();
  const [cartao_utilizado, setCartao] = useState<number | any>();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    tipoCompra: "",
    categoria: null as number | null,
    descricao: "",
    autorizadaPor: "",
    meioPagamento: null as number | null,
    cartao: null as number | null,
    parcelado: false,
    valor: 0,
    valorParcela: 0,
    quantidadeParcela: 0,
    valorFrete: 0,
    observacao: "",
    notaFiscal: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const enviarArquivoParaBackend = async (
    arquivo: File,
    tipo: any,
    index: number,
    Id: number
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

      const bodyArquivo = {
        caminho: data.caminho,
        nome: data.nome,
        tipo_id: tipo.id,
        formulario: true,
        transacao_id: Id,
      };

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

        const salvarResponse = await ApiNovo(
          "financeiro/arquivos/",
          "POST",
          bodyArquivo
        );

        const salvarData = await salvarResponse.json();

        if (!salvarResponse.ok) {
          console.error("Erro ao salvar arquivo no banco", salvarData);
        }
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    }
  };

  function enviarArquivo(Id: number) {
    listaArquivos &&
      listaArquivos.forEach((item, index) => {
        enviarArquivoParaBackend(item.arquivo, item.tipo, index, Id);
      });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dados = {
      ...formData,
      parcelado: parcelada,
    };

    if (!formData.descricao || !formData.autorizadaPor) {
      alert("Favor Inserir Dados Faltantes (Descrição ou Autorização)");
      return "";
    }

    const dataFormatada = date?.toISOString().split("T")[0];

    const payload = {
      data: dataFormatada,
      tipo: formData.tipoCompra,
      categoria_id: formData.categoria,
      descricao: formData.descricao,
      autorizado_por: formData.autorizadaPor,
      meio_pagamento_id: formData.meioPagamento,
      cartao_id: formData.cartao,
      compra_parcelara: formData.parcelado,
      observacao: formData.observacao,
      valor: formData.valor,
      valor_parcela: formData.valorParcela,
      quantidade_parcela: formData.quantidadeParcela,
      valor_frete: formData.valorFrete,
    };

    try {
      const res = await ApiNovo(
        `financeiro/formulario/formulario-compra/`,
        "POST",
        payload
      );
      const data = await res.json();

      // Verifica se há arquivos na lista e se a resposta retornou `ids`
      if (
        Array.isArray(listaArquivos) &&
        listaArquivos.length > 0 &&
        data?.id
      ) {
        enviarArquivo(data.id);
      }

      if (res.ok) {
        setOpen(true);
      } else {
        console.error("Erro ao salvar entrada:", data);
        alert("Erro ao salvar a entrada.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição ao salvar entrada.");
    }
  };

  const dilogFunc = async () => {
    setOpen(false);
    window.location.reload();
  };

  return (
    <>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-md" accessKey="">
          <DialogHeader>
            <DialogTitle>Compra Registrada</DialogTitle>
            <DialogDescription>
              Compra Registrada com Sucesso
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                dilogFunc();
              }}
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Card className="p-4 flex justify-center items-start max-w-3xl m-auto">
        <form
          onSubmit={handleSubmit}
          className="shadow-md rounded-xl p-6 w-full space-y-4"
        >
          <h1 className="text-2xl font-bold text-center mb-4">
            Formulário de Compra
          </h1>

          <div
            className={
              isMobile
                ? "flex flex-col gap-2"
                : "grid grid-cols-1 md:grid-cols-2 gap-4"
            }
          >
            <div className="flex-row">
              <Label className="pb-2">Data da Entrada:</Label>
              <DatePickerForm
                setFunc={setDate}
                date={date}
                className="w-full bg-transparent"
              />
            </div>

            <div className="flex-row">
              <Label className="pb-2">Tipo de Compra:</Label>
              <Select
                value={formData.tipoCompra}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tipoCompra: value }))
                }
              >
                <SelectTrigger className="w-full border p-2 rounded bg-black">
                  <SelectValue placeholder="---------" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="pb-2">Categoria:</Label>
              <SelectBaseBusca
                setFunc={(valor: { id: number; nome: string } | string) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoria:
                      typeof valor === "object" ? valor.id : Number(valor),
                  }))
                }
                query={CATEGORIAS_FORM_ENTRADA_QUERY}
                dataKey="categoriasFormEntrada"
                minutos={1}
                titulo="Categorias"
                className={"w-full bg-transparent"}
                value={formData.categoria}
              />
            </div>

            <div>
              <Label className="pb-2">Descrição:</Label>
              <Input
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <Label className="pb-2">Autorizada por:</Label>
              <Input
                name="autorizadaPor"
                value={formData.autorizadaPor}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <Label className="pb-2">Meio de Pagamento:</Label>
              <SelectBaseBusca
                setFunc={(valor: { id: number; nome: string } | string) =>
                  setFormData((prev) => ({
                    ...prev,
                    meioPagamento:
                      typeof valor === "object" ? valor.id : Number(valor),
                  }))
                }
                value={formData.meioPagamento}
                query={MEIO_TRANSACAO_FORM_QUERY}
                dataKey="meiosDeTransacao"
                minutos={60}
                titulo="Meios de Transações"
                className={"w-full"}
              />
            </div>

            <div>
              <Label className="pb-2">Cartão Utilizado:</Label>
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

            <div className="flex flex-row w-full items-center gap-1">
              <Input
                type="checkbox"
                id="parcelada"
                checked={parcelada}
                onChange={() => {
                  setParcelada(!parcelada);
                  setFormData((prev) => ({
                    ...prev,
                    parcelado: !parcelada,
                  }));
                }}
                className="w-6"
              />
              <Label htmlFor="parcelada">Compra parcelada?</Label>
            </div>

            <div>
              <Label className="pb-2">Valor:</Label>
              <Input
                type="number"
                step="0.01"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {parcelada && (
              <>
                <div>
                  <Label className="pb-2">Valor da Parcela:</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="valorParcela"
                    value={formData.valorParcela}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <Label className="pb-2">Quantidade de Parcelas:</Label>
                  <Input
                    type="number"
                    name="quantidadeParcela"
                    value={formData.quantidadeParcela}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </>
            )}

            <div>
              <Label className="pb-2">Valor Frete (caso se aplique):</Label>
              <Input
                type="number"
                step="0.01"
                name="valorFrete"
                value={formData.valorFrete}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="col-span-2">
              <Label className="pb-2">Observação:</Label>
              <Textarea
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label className="mb-4">Nota Fiscal:</Label>
              <SelectArquivo
                setListaArquivos={setListaArquivos}
                listaArquivos={listaArquivos}
              />
            </div>

            <div className="col-span-2 w-full">
              <Button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                  isMobile && "w-full"
                }`}
              >
                Enviar
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
