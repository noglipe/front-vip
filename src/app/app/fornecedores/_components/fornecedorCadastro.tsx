import { useState } from "react";
import client from "../../../../../apollo-client";
import FORNECEDORES_QUERY from "@/graphql/fornecedores-query";
import InputVip from "../../_components/inputVip";

export function FornecedorCadastro() {
  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    documento: "",
  });

  const adicionarFornecedor = async () => {
    if (novoFornecedor.nome) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/financeiro/fornecedor/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(novoFornecedor),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert(result.mensagem);

        // Atualize a lista de fornecedores após o cadastro
        client.refetchQueries({ include: [FORNECEDORES_QUERY] });

        setNovoFornecedor({ nome: "", documento: "" });
      } catch (error) {
        console.error("Erro ao cadastrar fornecedor:", error);
      }
    } else {
      alert("Dados Não Informados");
    }
  };

  return (
    <div className="bg-muted m-4 rounded-xl shadow-xl">
      {/* Formulário de Cadastro */}
      <div className=" flex flex-col p-4">
        <h2 className="text-xl font-semibold mb-1">Cadastrar Fornecedor</h2>
        <div className="flex flex-row gap-2 mt-2 p-4">
          <InputVip
            nome="Nome"
            value={novoFornecedor.nome}
            setValue={(valor) =>
              setNovoFornecedor({ ...novoFornecedor, nome: valor })
            }
            className="flex-1"
          />
          <InputVip
            nome="Documento"
            value={novoFornecedor.documento}
            setValue={(valor) => {
              setNovoFornecedor({ ...novoFornecedor, documento: valor });
            }}
            className="flex-1"
          />
          <button
            className="bg-green-600 rounded-md shadow-2xl
             hover:bg-green-500 hover:cursor-pointer p-1"
            onClick={() => {
              adicionarFornecedor();
            }}
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
