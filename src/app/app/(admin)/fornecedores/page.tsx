"use client";

import { useState } from "react";
import { FornecedorCadastro } from "./_components/fornecedorCadastro";
import { FornecedorLista } from "./_components/fornecedorLista";
import TransacoesFornecedor from "./_components/fornecedorTransacoes";

export default function FornecedoresPage() {
  const [idTransacao, setIdTransacao] = useState<number | null>(null);
  const [viewTransacoes, setViewTransacoes] = useState(false);
  const [refetchFornecedores, setRefetchFornecedores] = useState<() => void>(() => () => {});

  function handelView(id: number) {
    setIdTransacao(id);
    setViewTransacoes(true);
  }

  return (

    
      <div className="flex flex-col gap-4">
        <FornecedorCadastro />
        <div className="flex flex-1 w-full gap-4">
          <FornecedorLista
            setView={handelView}
            onRefetchReady={(refetchFn) =>
              setRefetchFornecedores(() => refetchFn)
            }
          />
          <TransacoesFornecedor
            view={viewTransacoes}
            id={idTransacao}
            setView={setViewTransacoes}
          />
        </div>
      </div>
 
  );
}
