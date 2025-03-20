// src/pages/fornecedores/_components/fornecedorEdicao.tsx

"use client";

import { useState, useEffect } from "react";
import InputVip from "../../_components/inputVip";


interface Fornecedor {
  id: number;
  nome: string;
  documento: string;
}

interface FornecedorEdicaoProps {
  fornecedor: Fornecedor;
  onSalvar: (fornecedorAtualizado: Fornecedor) => void;
  onCancelar: () => void;
}

export const FornecedorEdicao: React.FC<FornecedorEdicaoProps> = ({
  fornecedor,
  onSalvar,
  onCancelar,
}) => {
  const [fornecedorAtualizado, setFornecedorAtualizado] = useState(fornecedor);

  const handleSalvar = () => {
    onSalvar(fornecedorAtualizado);
  };

  return (
    <div className="bg-muted m-4 rounded-xl shadow-xl w-[300px]">
      <div className="flex flex-col p-4">
        <h2 className="text-xl font-semibold mb-1">Editar Fornecedor</h2>
        <div className="flex flex-col gap-2 mt-2 p-4">
          <InputVip
            nome="Nome"
            value={fornecedorAtualizado.nome}
            setValue={(valor) =>
              setFornecedorAtualizado({
                ...fornecedorAtualizado,
                nome: valor,
              })
            }
          />
          <InputVip
            nome="Documento"
            value={fornecedorAtualizado.documento}
            setValue={(valor) =>
              setFornecedorAtualizado({
                ...fornecedorAtualizado,
                documento: valor,
              })
            }
          />
          <div className="flex gap-2">
            <button
              className="bg-green-600 hover:bg-green-700 hover:cursor-pointer p-[4px]"
              onClick={handleSalvar}
            >
              Salvar
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 hover:cursor-pointer p-[4px]"
              onClick={onCancelar}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};