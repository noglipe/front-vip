"use client";

import { Card, CardContent } from "@/components/UI/card";

import Saldos from "./_components/saldos";
import NConclidas from "./_components/nConcluidas";
import ComprasCartaoMes from "./_components/comprasCartaoMes";

export default function DashboardFinanceiro() {
  const comprasCartao = 3200;

  return (
    <div>
      <div className="container mx-auto p-6  flex flex-col gap-6">
        <Saldos />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ComprasCartaoMes />

          <NConclidas />
        </div>
      </div>
    </div>
  );
}
