"use client";

import { DatePickerForm } from "@/components/form/datePickerForm";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import { CATEGORIAS_FORM_ENTRADA_QUERY } from "@/graphql/query";
import { ApiNovo } from "@/lib/api";
import { useEffect, useState } from "react";

interface Categoria {
  id: number;
  nome: string;
}
export default function EntradaPage() {
  const [date, setDate] = useState<Date | any>(new Date());
  const [formData, setFormData] = useState<{
    dataEntrada: string;
    referencia: string | number;
    descricao: string;
    dinheiro: number;
    pix: number;
    picpay: number;
    cartao: number;
    observacao: string;
  }>({
    dataEntrada: "",
    referencia: "",
    descricao: "",
    dinheiro: 0,
    pix: 0,
    picpay: 0,
    cartao: 0,
    observacao: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "dinheiro" ||
        name === "pix" ||
        name === "picpay" ||
        name === "cartao"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataFormatada = date?.toISOString().split("T")[0];

    if (!formData.descricao) {
      alert("Favor Inserir uma Descrição");
      return "";
    }

    const payload = {
      data: dataFormatada,
      categoria_id: Number(formData.referencia),
      descricao: formData.descricao,
      observacao: formData.observacao,
      dinheiro: formData.dinheiro,
      pix: formData.pix,
      picpay: formData.picpay,
      cartao: formData.cartao,
    };

    try {
      const res = await ApiNovo(
        `financeiro/formulario/formulario-entrada/`,
        "POST",
        payload
      );
      const data = await res.json();
      alert("Entrada salva com sucesso!");

      // Limpa o formulário após salvar (opcional)
      setFormData({
        dataEntrada: "",
        referencia: "",
        descricao: "",
        dinheiro: 0,
        pix: 0,
        picpay: 0,
        cartao: 0,
        observacao: "",
      });
      setDate(new Date());
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição ao salvar entrada.");
    }
  };

  return (
    <Card className="p-4 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className=" shadow-md rounded-xl p-6 w-full space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Formulário de Entrada
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block font-medium mb-1">Data da Entrada:</Label>
            <DatePickerForm
              setFunc={setDate}
              date={date}
              className="w-full bg-transparent"
            />
          </div>

          <div>
            <Label className="block font-medium mb-1">
              Entrada Referente a:
            </Label>
            <SelectBaseBusca
              setFunc={(valor: { id: number; nome: string } | string) =>
                setFormData((prev) => ({
                  ...prev,
                  referencia: typeof valor === "object" ? valor.id : valor,
                }))
              }
              query={CATEGORIAS_FORM_ENTRADA_QUERY}
              dataKey="categoriasFormEntrada"
              minutos={1}
              titulo="Categorias"
              className={"w-full bg-transparent"}
              value={formData.referencia}
            />
          </div>
        </div>

        <div>
          <Label className="block font-medium mb-1">Descrição:</Label>
          <Input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label className="block font-medium mb-1">Valor em Dinheiro:</Label>
            <Input
              type="number"
              step="0.01"
              name="dinheiro"
              value={formData.dinheiro}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <Label className="block font-medium mb-1">Valor em Pix:</Label>
            <Input
              type="number"
              step="0.01"
              name="pix"
              value={formData.pix}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <Label className="block font-medium mb-1">Valor em PicPay:</Label>
            <Input
              type="number"
              step="0.01"
              name="picpay"
              value={formData.picpay}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <Label className="block font-medium mb-1">Valor em Cartão:</Label>
            <Input
              type="number"
              step="0.01"
              name="cartao"
              value={formData.cartao}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div>
          <Label className="block font-medium mb-1">Observação:</Label>
          <Textarea
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="text-center">
          <Button
            type="submit"
            className="bg-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition text-white"
          >
            Salvar Entrada
          </Button>
        </div>
      </form>
    </Card>
  );
}
