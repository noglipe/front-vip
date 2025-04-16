"use client";

import Saldos from "./_components/saldos";
import NConclidas from "./_components/nConcluidas";
import ComprasCartaoMes from "./_components/comprasCartaoMes";
import { Card } from "@/components/UI/card";

export default function DashboardFinanceiro() {
  return (
    <section className="w-full p-0">
      <Card className="p-1 flex flex-col gap-2 bg-card-foreground">
        <Saldos />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 rounded-xl">
          <ComprasCartaoMes />

          <NConclidas />
        </div>
      </Card>
    </section>
  );
}
