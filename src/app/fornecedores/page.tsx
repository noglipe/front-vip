"use client";

import Input from "@/components/UI/Input";
import { useState } from "react";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([
    { id: 1, nome: "Filipe Nogueira", documento: "00000000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
  ]);

  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    documento: "",
  });

  const adicionarFornecedor = () => {

    if (novoFornecedor.nome && novoFornecedor.documento) {
      setFornecedores((prevFornecedores) => [
        ...prevFornecedores,
        { id: prevFornecedores.length + 1, ...novoFornecedor },
      ]);

      setNovoFornecedor({ nome: "", documento: "" });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Gerenciamento de Fornecedores</h1>

      {/* Formulário de Cadastro */}
      <div className="mb-4 p-4">
        <h2 className="text-xl font-semibold mb-2">Cadastrar Fornecedor</h2>
        <div className="grid grid-cols-3 items-center gap-2">
          <Input
            nome="Nome"
            value={novoFornecedor.nome}
            setValue={(valor) =>
              setNovoFornecedor({ ...novoFornecedor, nome: valor })
            }
          />
          <Input
            nome="Documento"
            value={novoFornecedor.documento}
            setValue={(valor) =>
              setNovoFornecedor({ ...novoFornecedor, documento: valor })
            }
          />
          <button
            className="bg-amber-600 hover:bg-amber-700 hover:cursor-pointer p-[4px]"
            onClick={adicionarFornecedor}
          >
            Cadastrar
          </button>
        </div>
      </div>

      {/* Lista de Fornecedores */}
      {fornecedores
        .slice()
        .sort((a, b) => adicionarFornecedor.name.localeCompare(b.nome))
        .map((fornecedor) => (
          <div
            key={fornecedor.id}
            className="mb-2 p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{fornecedor.nome}</p>
              <p className="text-gray-600">Documento: {fornecedor.documento}</p>
            </div>
            <div>
              <button className="mr-2 bg-blue-600 hover:bg-blue-800 hover:cursor-pointer p-2 rounded-md">
                Editar
              </button>
              <button className="mr-2 bg-blue-600 hover:bg-blue-800 hover:cursor-pointer p-2 rounded-md">
                Ver Transações
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
