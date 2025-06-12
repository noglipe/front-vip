"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/UI/chart";
import { formatReal } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type Mes = {
  mes: string;
  totalReceita: number;
  totalDespesa: number;
};

type Ano = {
  saltoTotal: number;
  totalReceita: number;
  totalDespesa: number;
  mes: Mes[];
};

interface Props {
  dados?: Ano;
}

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

const chartConfig = {
  receita: {
    label: "Receita",
    color: "var(--chart-2)",
  },
  despesa: {
    label: "Despesa",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export default function GraficoMeses({ dados }: Props) {
  const isMobile = useIsMobile();
  if (!dados) return null;

  const chartData = Object.entries(dados.mes)
    .sort(([a], [b]) => Number(a) - Number(b)) // Ordena os meses numericamente
    .map(([mes, valores]) => ({
      month: mesNome(mes),
      receita: Math.abs(Number(valores.totalReceita)),
      despesa: Math.abs(Number(valores.totalDespesa)),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas Por Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={5}
              axisLine={true}
              tickFormatter={(value) =>
                isMobile ? value.slice(0, 1) : value.slice(0, 3)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
            <Bar dataKey="despesa" fill="var(--color-despesa)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Saldo Total: {formatReal(dados.saltoTotal)}
        </div>
      </CardFooter>
    </Card>
  );
}
