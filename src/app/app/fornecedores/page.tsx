"use client";


import { FornecedorCadastro } from "./_components/fornecedorCadastro";
import { FornecedorLista } from "./_components/fornecedorLista";



export default function FornecedoresPage() {

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Gerenciamento de Fornecedores</h1>

      <div className="space-y-6">
        <FornecedorCadastro />
        <FornecedorLista />
        
      </div>
    </div>
  );
}
