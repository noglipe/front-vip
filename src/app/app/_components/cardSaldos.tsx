"use client";

import { Button } from "@/components/UI/button";
import { CardContent } from "@/components/UI/card";
import { formatReal } from "@/lib/utils";
import clsx from "clsx";
import { Eye, EyeClosed, LucideBanknote, Wallet } from "lucide-react";
import { useState } from "react";

export function CardSaldos(ObjList: CardSaldosProps & { ocultar: boolean }) {
  return (
    <div
      key={ObjList.id}
      className={clsx("p-4 cursor-default hover:bg-secondary", {})}
    >
      <CardContent>
        <h2 className="text-lg font-bold">
          <LucideBanknote />
          {ObjList.nome}
        </h2>
        {ObjList.saldo > 0 ? (
          <p className="text-2xl font-semibold">
            {ObjList.ocultar ? "R$ ******" : formatReal(ObjList.saldo)}
          </p>
        ) : (
          <p className="text-2xl font-semibold text-red-500 ">
            {ObjList.ocultar ? "R$ ******" : formatReal(ObjList.saldo)}
          </p>
        )}
      </CardContent>
    </div>
  );
}

export const PainelSaldos = ({
  titulo,
  objetos,
}: {
  titulo: string;
  objetos: CardSaldosProps[];
}) => {
  const [ocultar, SetOcultar] = useState(true);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex text-2xl  font-bold justify-between">
        <div className="uppercase flex flex-row gap-1 items-center">
          <Wallet />
          {titulo}
        </div>
        <Button onClick={() => SetOcultar(!ocultar)}>
          {ocultar ? <EyeClosed /> : <Eye />}
        </Button>
      </h2>
      <div className="flex flex-row flex-wrap items-end gap-2 bg-black rounded-md border-white">
        {objetos?.map((obj: CardSaldosProps) => (
          <CardSaldos key={obj.id} {...obj} ocultar={ocultar} />
        ))}
      </div>
    </section>
  );
};
