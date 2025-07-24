"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/UI/table";
import { formatData, formatReal } from "@/lib/utils";
import { IfConcluidoCircle } from "../(admin)/transacoes/_components/ifConcluido";
import { LinkVisualizar } from "../(admin)/transacoes/_components/btnVisualizar";
import { LinkEditar } from "../(admin)/transacoes/_components/tbnEditar";
import { LinkRecibo } from "../(admin)/transacoes/_components/tbnRecibo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { ArrowDownCircle, ArrowDownFromLine } from "lucide-react";
import { BtnConcluir } from "../(admin)/transacoes/_components/btnConcluir";
import { useEffect, useState } from "react";

interface Props {
  transacoes: TransacoesAPI[]; // já tipado corretamente aqui
}

export default function TabelaT({ transacoes }: Props) {
  const [dados, setTDados] = useState<TransacoesAPI[]>(transacoes || []);

  const CLASS_RECEITA = "text-green-400 cursor-pointer hover:bg-green-900";
  const CLASS_DESPESA = "text-red-400 cursor-pointer hover:bg-red-900";
  
  useEffect(() => {
    setTDados(transacoes || []);
  }, [transacoes]);

  function atualizarTransacaoConcluida(id: number, novoStatus: boolean) {
    setTDados((prev) =>
      prev.map((transacao) =>
        transacao.id === id
          ? { ...transacao, transacao_concluido: novoStatus }
          : transacao
      )
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Descrição / Categoria</TableHead>
          <TableHead>Meio de Pagamento</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead colSpan={3}>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(dados) &&
          dados.map((transacao, index) => (
            <TableRow
              key={index}
              className={transacao.receita ? CLASS_RECEITA : CLASS_DESPESA}
            >
              <TableCell className="justify-center items-center gap-1">
                <div className="flex justify-center items-center text-center gap-1">
                  <IfConcluidoCircle
                    concluido={transacao.transacao_concluido}
                  />
                  <div className="font-bold uppercase">
                    {transacao.receita ? "Receita" : "Despesa"}
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatData(transacao.data)}</TableCell>
              <TableCell>
                {transacao.descricao} / {transacao.categoria.nome}
              </TableCell>
              <TableCell>
                {transacao.meio_de_transacao?.nome || "N/A"} /{" "}
                {transacao.instituicao_financeira?.nome || "N/A"}
              </TableCell>
              <TableCell>{formatReal(transacao.valor)}</TableCell>
              <TableCell className="flex flex-row gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex flex-row items-center justify-center text-center gap-2 p-2 w-full border  rounded hover:cursor-pointer">
                    <ArrowDownCircle /> Ações
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Transação: #{transacao.id}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LinkVisualizar id={transacao.id} />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BtnConcluir
                        id={transacao.id}
                        status={transacao.transacao_concluido}
                        onStatusChange={atualizarTransacaoConcluida}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LinkEditar
                        id={transacao.id}
                        receita={transacao.receita}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LinkRecibo id={transacao.id} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
