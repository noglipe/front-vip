"use client";

import { useState } from "react";

import { DatePickerForm } from "../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";

import { SelectBase } from "@/components/form/selectBase";

import { SelectBaseBusca } from "@/components/form/selectBaseBusca";

import {
  CATEGORIAS_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
} from "@/graphql/query";
import { ComboboxDemo } from "@/components/form/text";

export default function CadastroReceitaPage() {
  const [caixa, setCaixa] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [meioTransacao, setMeioTransacao] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const [receita, setReceita] = useState({
    data: "",
    valor: "",
    categoria: "",
    meioTransacao: "",
    instituicaoFinanceira: "",
    transacaoConcluida: false,
    descricao: "",
    observacao: "",
    fornecedor: "",
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 ">Cadastro de Receita</h1>
      <div className="grid grid-cols-4 gap-4">
        <DatePickerForm setFunc={setDate} />
        <Input
          type="number"
          placeholder="Valor"
          className="h-full w-full px-2 border-1 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SelectBase
          setFunc={setMeioTransacao}
          query={MEIO_TRANSACAO_FORM_QUERY}
          dataKey="meiosDeTransacao"
          minutos={10}
        />
        <SelectBaseBusca
          setFunc={setCategoria}
          query={CATEGORIAS_FORM_QUERY}
          dataKey="categorias"
          minutos={10}
        />
      </div>
      {categoria}
    </div>
  );
}
