// components/TabelaTransacoes.tsx

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/UI/table";
import { formatData, formatReal } from "@/lib/utils"; // ajuste o caminho conforme sua estrutura
import { IfConcluidoCircle } from "../(admin)/transacoes/_components/ifConcluido";
import BtnVisualizar from "../(admin)/transacoes/_components/btnVisualizar";
import { BtnEditar } from "../(admin)/transacoes/_components/tbnEditar";
import BtnRecibo from "../(admin)/transacoes/_components/tbnRecibo";

interface Props {
  transacoes: string | TransacoesAPI[];
}

export default function TabelaT({ transacoes }: Props) {
  const CLASS_RECEITA = "text-green-400 cursor-pointer hover:bg-green-900";
  const CLASS_DESPESA = "text-red-400 cursor-pointer hover:bg-red-900";

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
        {Array.isArray(transacoes) &&
          transacoes.map((transacao, index) => (
            <TableRow
              key={index}
              className={transacao.receita ? CLASS_RECEITA : CLASS_DESPESA}
            >
              <TableCell className="justify-center items-center gap-1">
                <div className="flex justify-center items-center text-center gap-1">
                  <IfConcluidoCircle
                    concluido={transacao.transacao_concluido || false}
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
                <BtnVisualizar id={transacao.id.toString()} />
                <BtnEditar
                  receita={transacao.receita}
                  id={transacao.id.toString()}
                />
                <BtnRecibo id={transacao.id.toString()} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
