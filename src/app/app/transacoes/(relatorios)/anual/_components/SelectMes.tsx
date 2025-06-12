import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";

interface Props {
  mes: string | null | undefined;
  setMes: (mes: string | null | undefined) => void;
  ativo: boolean;
}
export default function SelectMes({ mes, setMes, ativo }: Props) {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <Select
      value={mes || undefined}
      onValueChange={(value) => setMes(value === "all" ? null : value)}
      disabled={ativo}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar mês" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os meses</SelectItem>
        {meses.map((value, index) => (
          <SelectItem key={value} value={(index + 1).toString()}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
