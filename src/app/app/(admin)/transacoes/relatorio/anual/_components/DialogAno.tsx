import { Button } from "@/components/UI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { CalendarIcon } from "lucide-react";

interface Props {
  ano: number | null;
  setAno: (ano: number | null) => void;
}

export default function DialogAno({ setAno, ano }: Props) {
  const anos = (() => {
    const anoAtual = new Date().getFullYear();
    const lista = [];

    for (let i = 0; i < 10; i++) {
      lista.push(anoAtual - i);
    }

    return lista;
  })();

  return (
    <Dialog>
      <DialogTrigger asChild className="w-[180px]">
        <Button variant="outline">  
          <CalendarIcon className="h-4 w-4 mr-2" />
        {ano ? ano : "Selecionar Ano"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecione o Ano</DialogTitle>
          <DialogDescription>
            Selecione um ano para visualizar o relatório financeiro
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Select
            value={ano?.toString() || ""}
            onValueChange={(value) => setAno(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder=" 📅 Escolha um ano " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {anos.map((a) => (
                  <SelectItem value={a.toString()}>{a}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Selecionar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
