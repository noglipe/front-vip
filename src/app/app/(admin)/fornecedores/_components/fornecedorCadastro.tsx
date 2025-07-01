import { useState } from "react";
import client from "../../../../../lib/apollo-client";

import InputVip from "../../../_components/inputVip";
import { FORNECEDORES_QUERY } from "@/graphql/query";
import { MiniLoading } from "@/components/loading";
import { Card } from "@/components/UI/card";
import { ApiNovo } from "@/lib/api";
import { Button } from "@/components/UI/button";

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
      const response = await ApiNovo(
        "financeiro/fornecedor/",
        "POST",
        novoFornecedor
      );

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
    <Card className=" shadow-lg rounded-xl p-6 ">
      <h2 className="text-xl font-semibold mb-4">Cadastrar Fornecedor</h2>
      <div className="flex flex-row gap-4">
        <InputVip
          placeholder="Nome"
          value={novoFornecedor.nome}
          setValue={(valor) =>
            setNovoFornecedor({ ...novoFornecedor, nome: valor })
          }
        />
        <InputVip
          placeholder="Documento"
          value={novoFornecedor.documento}
          setValue={(valor) =>
            setNovoFornecedor({ ...novoFornecedor, documento: valor })
          }
        />
        <Button
          className="flex gap-2 font-semibold rounded-sm shadow-md transition"
          onClick={adicionarFornecedor}
        >
          {loading ? <MiniLoading /> : ""} Cadastrar
        </Button>
      </div>
    </Card>
  );
}
