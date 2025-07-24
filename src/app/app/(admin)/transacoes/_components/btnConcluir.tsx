"use client";

import { useRouter } from "next/navigation";
import { IfConcluidoCircle } from "./ifConcluido";
import { useState } from "react";
import { ApiNovo } from "@/lib/api";
import { toast } from "sonner";
import { MiniLoading } from "@/components/loading";

interface BtnProps {
  id: string | number;
  status: boolean;
  onStatusChange?: (id: number, novoStatus: boolean) => void;
}

export const BtnConcluir = ({ id, status, onStatusChange }: BtnProps) => {
  const [loading, setLoading] = useState(false);
  const [concluido, setConcluido] = useState(status);
  const router = useRouter();

  async function alterarStatusTransacao(id: string | number) {
    try {
      setLoading(true);

      const response = await ApiNovo(
        `financeiro/transacao/alterar-concluir/`,
        "POST",
        { id }
      );

      const data = await response.json();

      setConcluido(data.novo_status);

      // Chama callback para atualizar o pai, se existir
      onStatusChange?.(Number(id), data.novo_status);

      toast.success("Status Concluir Alterado!");
    } catch (error) {
      toast.error("Erro", {
        description: `Erro ao alterar status concluido: ${String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="button"
      className="flex flex-row gap-2 items-center cursor-pointer select-none"
      onClick={() => alterarStatusTransacao(id)}
    >
      {loading ? (
        <MiniLoading />
      ) : (
        <IfConcluidoCircle concluido={concluido} />
      )}
      {loading
        ? "Atualizando..."
        : concluido
        ? "Alterar para Não Concluída"
        : "Concluir Transação"}
    </div>
  );
};
