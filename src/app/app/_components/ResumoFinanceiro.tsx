// components/ResumoFinanceiro.tsx

import { Card } from "@/components/UI/card";
import PainelValor from "../(admin)/transacoes/_components/painelValor";


interface Props {
  totalReceitas: number;
  totalDespesas: number;
}

export default function ResumoFinanceiro({
  totalReceitas,
  totalDespesas,

}: Props) {
  return (
    <Card className="container p-4 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PainelValor valor={totalReceitas} title="Total de Receitas" />
        <PainelValor valor={totalDespesas} title="Total de Despesas" />
        <PainelValor
          valor={totalReceitas+totalDespesas}
          title="Diferença (Lucro / Prejuízo)"
        />
      </div>
    </Card>
  );
}
