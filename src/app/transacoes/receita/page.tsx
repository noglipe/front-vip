"use client";

import { useState } from "react";
import Input from "@/components/UI/Input"; // Reutilizando o componente de Input

export default function CadastroReceitaPage() {
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

  const handleChange = (campo: string, valor: any) => {
    setReceita((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const salvarReceita = () => {
    console.log("Receita cadastrada:", receita);
    alert("Receita cadastrada com sucesso!");
    setReceita({
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
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Cadastro de Receita</h1>

      {/* Formulário */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          nome="Data"
          value={receita.data}
          setValue={(valor) => handleChange("data", valor)}
        />
        <Input
          nome="Valor"
          value={receita.valor}
          setValue={(valor) => handleChange("valor", valor)}
        />

        {/* Categoria */}
        <select
          className="border p-2 rounded"
          value={receita.categoria}
          onChange={(e) => handleChange("categoria", e.target.value)}
        >
          <option value="">Selecione a Categoria</option>
          <option value="Salário">Salário</option>
          <option value="Investimento">Investimento</option>
          <option value="Outros">Outros</option>
        </select>

        {/* Meio de Transação */}
        <select
          className="border p-2 rounded"
          value={receita.meioTransacao}
          onChange={(e) => handleChange("meioTransacao", e.target.value)}
        >
          <option value="">Selecione o Meio de Transação</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Transferência">Transferência</option>
        </select>

        {/* Instituição Financeira */}
        <Input
          nome="Instituição Financeira"
          value={receita.instituicaoFinanceira}
          setValue={(valor) => handleChange("instituicaoFinanceira", valor)}
        />

        {/* Fornecedor */}
        <Input
          nome="Fornecedor"
          value={receita.fornecedor}
          setValue={(valor) => handleChange("fornecedor", valor)}
        />

        {/* Transação Concluída (Checkbox) */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={receita.transacaoConcluida}
            onChange={(e) => handleChange("transacaoConcluida", e.target.checked)}
            className="mr-2"
          />
          <label>Transação Concluída</label>
        </div>

        {/* Descrição */}
        <textarea
          placeholder="Descrição"
          className="border p-2 rounded w-full"
          value={receita.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
        />

        {/* Observação */}
        <textarea
          placeholder="Observação"
          className="border p-2 rounded w-full"
          value={receita.observacao}
          onChange={(e) => handleChange("observacao", e.target.value)}
        />
      </div>

      {/* Botão de Salvar */}
      <button
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-4 w-full"
        onClick={salvarReceita}
      >
        Salvar Receita
      </button>
    </div>
  );
}
