"use client";

import { useState } from "react";
import InputVip from "../_components/inputVip";
import { ListFilter, Pen, PenBox, PenBoxIcon, PenLine } from "lucide-react";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([
    { id: 1, nome: "Filipe Nogueira", documento: "00000000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
    { id: 2, nome: "Filipe Nogueira 2", documento: "00256000" },
    { id: 3, nome: "Filipe Nogueira 3", documento: "002464000" },
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
    <div className="container p-4">
      <h1 className="text-4xl font-bold mb-4">Gerenciamento de Fornecedores</h1>

      <div className="flex flex-row flex-wrap gap-2">
        <div className="bg-muted m-4 rounded-xl shadow-xl w-[300px]">
          {/* Formulário de Cadastro */}
          <div className=" flex flex-col p-4">
            <h2 className="text-xl font-semibold mb-1">Cadastrar Fornecedor</h2>
            <div className="flex flex-col gap-2 mt-2 p-4">
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
                className="bg-green-600 hover:bg-green-700 hover:cursor-pointer p-[4px]"
                onClick={adicionarFornecedor}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-muted m-4 rounded-xl shadow-xl w-[700px]">
          {/* Lista de Fornecedores */}
          <div className="mb-4 p-4">
            <h2 className="text-xl font-semibold mb-1">
              Lista de Fornecedores
            </h2>
            <div className="flex flex-col gap-2 mt-2 ">
              {fornecedores
                .slice()
                .sort((a, b) => adicionarFornecedor.name.localeCompare(b.nome))
                .map((fornecedor) => (
                  <div
                    key={fornecedor.id}
                    className="mb-2 flex justify-between items-center w-full"
                  >
                    <div className="pr-4">
                      <p className="text-lg font-medium">{fornecedor.nome}</p>
                      <p className="text-gray-600">
                        Documento: {fornecedor.documento}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="flex gap-2 bg-gray-400 hover:bg-gray-600 
                    hover:cursor-pointer hover:text-white px-2 py-1 rounded-sm "
                      >
                        <PenLine /> Editar
                      </button>
                      <button
                        className="flex gap-2 bg-gray-400 hover:bg-gray-600 hover:cursor-pointer
                    hover:text-white  px-2 py-1 rounded-sm"
                      >
                        <ListFilter /> Transações
                      </button>
                    </div>
                  </div>
                ))}
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
