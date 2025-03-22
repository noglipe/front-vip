import { useState } from "react";
import client from "../../../../lib/apollo-client";

import InputVip from "../../_components/inputVip";
import { FORNECEDORES_QUERY } from "@/graphql/fornecedores-query";
import { MiniLoading } from "@/components/loading";

export function FornecedorCadastro() {
  const [loading, setLoading] = useState(false);
  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    documento: "",
  });

  const adicionarFornecedor = async () => {
    setLoading(true);
    if (!novoFornecedor.nome) {
      alert("Dados Não Informados");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financeiro/fornecedor/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoFornecedor),
        }
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(result.mensagem);

      client.refetchQueries({ include: [FORNECEDORES_QUERY] });
      setNovoFornecedor({ nome: "", documento: "" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao cadastrar fornecedor:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 ">
      <h2 className="text-xl font-semibold mb-4">Cadastrar Fornecedor</h2>
      <div className="flex flex-row gap-4">
        <InputVip
          nome="Nome"
          value={novoFornecedor.nome}
          setValue={(valor) =>
            setNovoFornecedor({ ...novoFornecedor, nome: valor })
          }
        />
        <InputVip
          nome="Documento"
          value={novoFornecedor.documento}
          setValue={(valor) =>
            setNovoFornecedor({ ...novoFornecedor, documento: valor })
          }
        />
        <button
          className="flex gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          onClick={adicionarFornecedor}
        >
          {loading ? <MiniLoading /> : ""} Cadastrar
        </button>
      </div>
    </div>
  );
}
