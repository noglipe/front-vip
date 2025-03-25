"use client";

import Saldos from "./_components/saldos";
import NConclidas from "./_components/nConcluidas";
import ComprasCartaoMes from "./_components/comprasCartaoMes";

export default function DashboardFinanceiro() {
  const comprasCartao = 3200;

  return (
    <div>
      <div className="container mx-auto p-6 flex flex-col gap-2">
        <Saldos />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-2 rounded-xl">
          <ComprasCartaoMes />

          <NConclidas />
        </div>
      </div>
    </div>
  );
}
