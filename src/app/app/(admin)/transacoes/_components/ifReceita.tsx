import { formatReal } from "@/lib/utils";

interface ReceitaProps {
  receita: boolean;
  valor: number;
}

export function IfReceitaValor({ receita, valor }: ReceitaProps) {
  return (
    <div
      className={`flex items-center font-semibold ${
        receita ? "text-green-600" : "text-red-600"
      }`}
    >
      {formatReal(Math.abs(valor))}
    </div>
  );
}
