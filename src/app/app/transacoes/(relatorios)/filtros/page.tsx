"use client"

import { Card } from "@/components/UI/card";
import { useState } from "react";
import FiltrosTransacoes from "../_components/filtros";

export default function Page() {
    const[dados, setDados] = useState<TransacoesPropsApi>()

  return (
    <section className="container p-8">
      <Card className="p-4 w-full">
        <FiltrosTransacoes />
        <div>filtros</div>
        <div>Tabela</div>
      </Card>
    </section>
  );
}
