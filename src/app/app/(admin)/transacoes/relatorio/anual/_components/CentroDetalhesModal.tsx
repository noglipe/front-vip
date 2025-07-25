import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Loading } from "@/components/loading";
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
import { Button } from "@/components/UI/button";
import { ApiNovo } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  nomeCentro: string;
  ano: number | null;
}

interface Categoria {
  despesa: number | null;
  nome: string;
  receita: number | null;
}

interface Detalhe {
  id: number;
  nome: string;
  total: number;
  totalDespesa: number;
  totalReceita: number;
  categorias: Categoria[];
}

export function CentroDetalhesModal({ open, onClose, nomeCentro, ano }: Props) {
  const [dados, setDados] = useState<Detalhe[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);

      const getDados = async () => {
        const response = await ApiNovo(
          `financeiro/centro-de-custo/?centro=${nomeCentro}&ano=${ano}`
        );
        const dados = await response.json();
        setDados(dados);
        setLoading(false);
      };

      getDados();
    }
  }, [open, nomeCentro]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[50vw] max-h-[80vh] overflow-auto">
        <DialogClose className="absolute top-4 right-4">
          <XIcon className="h-4 w-4" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-left">{nomeCentro}</DialogTitle>
        </DialogHeader>
        {loading && <Loading />}
        {!loading && dados?.length ? (
          <div className="">
            {dados.map((item, index) => (
              <div key={index} className="flex  flex-col border-b pb-1">
                <div className="w-full overflow-x-auto max-h-[400px]">
                  <Table className="max-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">
                          Categoria
                        </TableHead>
                        <TableHead className="whitespace-nowrap text-green-500">
                          Receita
                        </TableHead>
                        <TableHead className="whitespace-nowrap text-red-500">
                          Despesa
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="w-full">
                      {item.categorias.map((item) => (
                        <TableRow key={item.nome}>
                          <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis ">
                            {item.nome}
                          </TableCell>
                          <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis text-green-500">
                            {formatReal(item.receita)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis text-red-500">
                            {formatReal(item.despesa)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-row gap-4 w-full mt-4">
                  <div className="flex flex-col text-left ">
                    Receita:
                    <br />
                    {formatReal(item.totalReceita)}
                  </div>
                  <div>
                    Despesa:
                    <br />
                    {formatReal(item.totalDespesa)}
                  </div>
                  <div className="flex flex-col text-left">
                    Total:
                    <br />
                    {formatReal(item.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>Nenhum detalhe encontrado.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
