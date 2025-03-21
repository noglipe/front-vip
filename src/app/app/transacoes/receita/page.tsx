"use client";

import { useState } from "react";

import { SelectCaixa } from "../_components/selectCaixa";
import { SelectCategorias } from "../_components/selectCategoria";
import { DatePickerForm } from "../_components/datePickerForm";
import { Input } from "@/components/UI/input";

export default function CadastroReceitaPage() {
  const [caixa, setCaixa] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);
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
        <Input type="number" placeholder="Valor" className="h-full w-full px-2 border-1 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <SelectCategorias setFunc={setCategoria} minutos={0.5} />
      </div>
      {date && date.toLocaleDateString()}
    </div>
  );
}
