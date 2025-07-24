"use client";

import { Button } from "@/components/UI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";

import { ApiNovo } from "@/lib/api";
import { toast } from "sonner";

type Arquivo = {
  id: number;
  link: string;
  tipo: string;
};

type Item = {
  id: number;
  data: string;
  descricao: string;
  dinheiro: string;
  pix: string;
  picpay: string;
  cartao: string;
  categoria: string | null;
  validado: boolean;
  arquivos?: Arquivo[];
};

interface Props {
  item?: Item;
  onValidated?: () => void;
}

export default function Validar({ item, onValidated }: Props) {
  async function ok() {
    if (!item?.id) return;
    try {
      const response = await ApiNovo(
        `financeiro/formulario/formulario-entrada/validar/${item.id}`
      );
      toast.success(`Validação feita com sucesso ${response}`);

      onValidated?.();
    } catch (error) {
      toast.error(`Erro ao validar: ${error}`);
      throw new Error(`Erro ao validar: ${error}`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Validar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validação de Entrada?</DialogTitle>
          <DialogDescription className="flex flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={ok} className="cursor-pointer" type="button">
                Validar
              </Button>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
