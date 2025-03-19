"use client";

import { useState } from "react";
import Input from "@/components/UI/Input";

export default function CadastroDespesaPage() {
  const [despesa, setDespesa] = useState({
    dataPagamento: "",
    dataCompra: "",
    transacaoConcluida: false,
    valor: "",
    meioTransacao: "",
    instituicaoFinanceira: "",
    categoria: "",
    cartaoUtilizado: "",
    situacaoFiscal: "",
    descricao: "",
    fornecedor: "",
    observacao: "",
    arquivos: [],
  });

  const [novoArquivo, setNovoArquivo] = useState({
    file: null,
    tipo: "",
  });

  const handleChange = (campo: string, valor: any) => {
    setDespesa((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const adicionarArquivo = () => {
    if (novoArquivo.file && novoArquivo.tipo) {
      setDespesa((prev) => ({
        ...prev,
        arquivos: [...prev.arquivos, novoArquivo],
      }));
      setNovoArquivo({ file: null, tipo: "" });
    }
  };

  const salvarDespesa = () => {
    console.log("Despesa cadastrada:", despesa);
    alert("Despesa cadastrada com sucesso!");
    setDespesa({
      dataPagamento: "",
      dataCompra: "",
      transacaoConcluida: false,
      valor: "",
      meioTransacao: "",
      instituicaoFinanceira: "",
      categoria: "",
      cartaoUtilizado: "",
      situacaoFiscal: "",
      descricao: "",
      fornecedor: "",
      observacao: "",
      arquivos: [],
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Cadastro de Despesa</h1>

      {/* Formulário */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          nome="Data de Pagamento"
          value={despesa.dataPagamento}
          setValue={(valor) => handleChange("dataPagamento", valor)}
        />
        <Input
          nome="Data de Compra"
          value={despesa.dataCompra}
          setValue={(valor) => handleChange("dataCompra", valor)}
        />
        <Input
          nome="Valor"
          value={despesa.valor}
          setValue={(valor) => handleChange("valor", valor)}
        />

        {/* Meio de Transação */}
        <select
          className="border p-2 rounded"
          value={despesa.meioTransacao}
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
          value={despesa.instituicaoFinanceira}
          setValue={(valor) => handleChange("instituicaoFinanceira", valor)}
        />

        {/* Categoria */}
        <select
          className="border p-2 rounded"
          value={despesa.categoria}
          onChange={(e) => handleChange("categoria", e.target.value)}
        >
          <option value="">Selecione a Categoria</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>

        {/* Cartão Utilizado */}
        <Input
          nome="Cartão Utilizado"
          value={despesa.cartaoUtilizado}
          setValue={(valor) => handleChange("cartaoUtilizado", valor)}
        />

        {/* Situação Fiscal */}
        <select
          className="border p-2 rounded"
          value={despesa.situacaoFiscal}
          onChange={(e) => handleChange("situacaoFiscal", e.target.value)}
        >
          <option value="">Selecione a Situação Fiscal</option>
          <option value="Dedutível">Dedutível</option>
          <option value="Não Dedutível">Não Dedutível</option>
        </select>

        {/* Fornecedor */}
        <Input
          nome="Fornecedor"
          value={despesa.fornecedor}
          setValue={(valor) => handleChange("fornecedor", valor)}
        />

        {/* Transação Concluída (Checkbox) */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={despesa.transacaoConcluida}
            onChange={(e) =>
              handleChange("transacaoConcluida", e.target.checked)
            }
            className="mr-2"
          />
          <label>Transação Concluída</label>
        </div>

        {/* Descrição */}
        <textarea
          placeholder="Descrição"
          className="border p-2 rounded w-full"
          value={despesa.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
        />

        {/* Observação */}
        <textarea
          placeholder="Observação"
          className="border p-2 rounded w-full"
          value={despesa.observacao}
          onChange={(e) => handleChange("observacao", e.target.value)}
        />
      </div>

      {/* Upload de Arquivos */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Anexar Arquivos</h2>
        <input
          type="file"
          onChange={(e) =>
            setNovoArquivo({
              ...novoArquivo,
              file: e.target.files?.[0] || null,
            })
          }
          className="border p-2 rounded w-full"
        />
        <select
          className="border p-2 rounded w-full mt-2"
          value={novoArquivo.tipo}
          onChange={(e) =>
            setNovoArquivo({ ...novoArquivo, tipo: e.target.value })
          }
        >
          <option value="">Selecione o Tipo de Arquivo</option>
          <option value="Nota Fiscal">Nota Fiscal</option>
          <option value="Comprovante de Pagamento">
            Comprovante de Pagamento
          </option>
        </select>
        <button
          onClick={adicionarArquivo}
          className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
        >
          Adicionar Arquivo
        </button>

        {/* Lista de Arquivos Adicionados */}
        <ul className="mt-4">
          {despesa.arquivos.map((arquivo, index) => (
            <li
              key={index}
              className="p-2 border rounded mt-2 flex justify-between"
            >
              <span>
                {arquivo.file?.name} - {arquivo.tipo}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Botão de Salvar */}
      <button
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-4 w-full"
        onClick={salvarDespesa}
      >
        Salvar Despesa
      </button>
    </div>
  );
}
