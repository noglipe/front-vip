import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { formatReal } from "@/lib/utils";

interface PainelProps {
  valor: number | undefined;
  title: string;
}

export default function PainelValor({ valor = 0, title }: PainelProps) {
  const bg = valor > -1 ? "bg-green-800" : "bg-red-800";
  const txt = valor > -1 ? "text-green-50" : "text-red-50";

  return (
    <Card className={`p-4 ${bg} rounded-md`}>
      <CardHeader>
        <CardTitle>
          <div className={`text-lg font-bold ${txt}`}>{title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{formatReal(valor)}</p>
      </CardContent>
    </Card>
  );
}
