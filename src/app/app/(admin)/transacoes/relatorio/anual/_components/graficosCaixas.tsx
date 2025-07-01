"use client";

import * as React from "react";

import { Label, Pie, PieChart } from "recharts";

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
} from "@/components/UI/chart";
import { formatReal } from "@/lib/utils";

interface ExternalData {
  nome: string;
  saldoTotal: number;
  total: {
    totalReceita: number;
    totalDespesa: number;
    total: number;
  };
}

interface GraficoCaixasProps {
  data: ExternalData;
}

export default function GraficoCaixas({ data }: GraficoCaixasProps) {
  const normalizeFactor = 10000;

  const chartData = React.useMemo(() => {
    return [
      {
        legenda: "Receita",
        valor: Math.abs(data.total.totalReceita),
        fill: "var(--chart-2)",
      },
      {
        legenda: "Despesa",
        valor: Math.abs(data.total.totalDespesa),
        fill: "var(--chart-5)",
      },
    ];
  }, [data]);

  const totalVisitors = React.useMemo(() => {
    return Math.abs(data.total.total); // usa total absoluto, para evitar números negativos no centro
  }, [data]);

  const chartConfig = {
    Receita: {
      label: "Receita",
      color: "var(--chart-1)",
    },
    Despesa: {
      label: "Despesa",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  function CustomTooltipContent({ payload, label, active }: any) {
    if (active && payload && payload.length) {
      const data = payload[0];
      const cor = data.fill || data.payload.fill;
      return (
        <div className="p-2 rounded border shadow bg-black">
          <div
            className="p-2 w-4 rounded border shadow"
            style={{ backgroundColor: `${cor}` }}
          ></div>
          <p>{data.name}</p>
          <p>
            {formatReal(data.value)}{" "}
            {/* multiplica pelo fator de normalização */}
          </p>
        </div>
      );
    }

    return null;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{data.nome}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<CustomTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="valor"
              nameKey="legenda"
              innerRadius={60}
              strokeWidth={1}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-md font-bold"
                        >
                          {formatReal(totalVisitors)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Saldo Filtro
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Saldo total: {formatReal(data.saldoTotal)}
        </div>
      </CardFooter>
    </Card>
  );
}
