"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/UI/dialog";
import { formatReal } from "@/lib/utils";
import { CircleCheckBig, CircleEllipsis, TextQuote, X } from "lucide-react";
import { TRANSACAO_RELACIONADA_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import client from "../../../../lib/apollo-client";
import { MiniLoading } from "@/components/loading";
import Link from "next/link";
import { Button } from "@/components/UI/button";

interface Parcelas {
  id: string;
  data: string;
  valor: number;
  parcelaAtual: number;
  transacaoConcluido: boolean;
  rastreioParcelas: {
    valorTotal: number;
  };
}

interface TransacoesRelacionadasProps {
  id: string;
}

export default function TransacaoRelacionadas({
  id,
}: TransacoesRelacionadasProps) {
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState<Parcelas[]>();
  const TransacoesId = parseInt(id as string);
  const { loading, error, data } = useQuery<{
    transacoesParceladas: Parcelas[];
  }>(TRANSACAO_RELACIONADA_QUERY, {
    variables: { id: TransacoesId },
    client,
  });

  useEffect(() => {
    console.log(data);
    if (data?.transacoesParceladas) {
      setDados(data.transacoesParceladas);
    }
  }, [data]);

  if (loading) return <MiniLoading />;
  if (error)
    return <p className="text-center text-red-500">Erro: {error.message}</p>;

  return (
    <>
      {/* Botão para abrir o modal */}
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg"
      >
        <TextQuote size={18} /> Transações Relacionadas
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transações Relacionadas</DialogTitle>
            <DialogClose asChild></DialogClose>
          </DialogHeader>

          {/* Lista de Transações Relacionadas */}
          <div className="space-y-3 mt-4">
            <div className="flex flex-col justify-between items-center border-b pb-2 last:border-b-0">
              {dados &&
                dados
                  .slice()
                  .reverse()
                  .map((parcela, index) => (
                    <Link href={`/app/transacoes/${parseInt(parcela.id)}`} key={index}>
                    <div
                      
                      className="flex gap-2 p-2 w-full items-center"
                    >
                      {parcela.transacaoConcluido ? (
                        <CircleCheckBig className="text-green-600" size={32} />
                      ) : (
                        <CircleEllipsis className="text-gray-500" size={32} />
                      )}
                      <span>#{parcela.id}</span> -
                      <span>Parcela {parcela.parcelaAtual}</span> -
                      <span>
                        {new Date(parcela.data).toLocaleDateString("pt-BR")}
                      </span>
                      - <span> {formatReal(parcela.valor)}</span>
                    </div>
                    </Link>
                  ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
