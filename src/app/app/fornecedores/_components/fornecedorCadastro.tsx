import { useState } from "react";
import client from "../../../../../apollo-client";
import FORNECEDORES_QUERY from "@/graphql/fornecedores-query";
import InputVip from "../../_components/inputVip";

export function FornecedorCadastro() {
  const [novoFornecedor, setNovoFornecedor] = useState({ nome: "", documento: "" });

  const adicionarFornecedor = async () => {
    if (!novoFornecedor.nome) {
      alert("Dados Não Informados");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/financeiro/fornecedor/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoFornecedor),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      alert(result.mensagem);

      client.refetchQueries({ include: [FORNECEDORES_QUERY] });
      setNovoFornecedor({ nome: "", documento: "" });

    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Cadastrar Fornecedor</h2>
      <div className="flex flex-col gap-4">
        <InputVip
          nome="Nome"
          value={novoFornecedor.nome}
          setValue={(valor) => setNovoFornecedor({ ...novoFornecedor, nome: valor })}
        />
        <InputVip
          nome="Documento"
          value={novoFornecedor.documento}
          setValue={(valor) => setNovoFornecedor({ ...novoFornecedor, documento: valor })}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          onClick={adicionarFornecedor}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}
