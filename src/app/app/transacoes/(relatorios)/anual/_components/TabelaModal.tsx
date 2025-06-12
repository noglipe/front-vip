import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { formatReal } from "@/lib/utils";
import { XIcon } from "lucide-react";

type Mes = {
  totalReceita: number;
  totalDespesa: number;
};

type Ano = {
  saltoTotal: number;
  mes: Mes[];
};

type Props = {
  ano?: Ano | undefined;
  open: boolean;
  onClose: () => void;
};

const mesNome = (numero: string) =>
  ({
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
  }[numero] ?? numero);

export function TabelaModal({ open, onClose, ano }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] max-h-[80vh] overflow-auto">
        <DialogClose className="absolute top-4 right-4">
          <XIcon className="h-4 w-4" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-left"></DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableHead>Mês</TableHead>
            <TableHead>Receita</TableHead>
            <TableHead>Dispesa</TableHead>
            <TableHead>Total</TableHead>
          </TableHeader>
          <TableBody>
            {ano &&
              Object.entries(ano.mes)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([numeroMes, dados]) => (
                  <TableRow key={numeroMes}>
                    <TableCell>{mesNome(numeroMes)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatReal(dados.totalReceita)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {formatReal(dados.totalDespesa)}
                    </TableCell>
                    <TableCell
                      className={`${
                        Number(dados.totalReceita) +
                          Number(dados.totalDespesa) >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatReal(
                        Number(dados.totalReceita) + Number(dados.totalDespesa)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
