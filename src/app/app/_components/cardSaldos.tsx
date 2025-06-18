import { Card, CardContent } from "@/components/UI/card";
import { formatReal } from "@/lib/utils";
import clsx from "clsx";
import { LucideBanknote, Wallet  } from "lucide-react";

export function CardSaldos(ObjList: CardSaldosProps) {
  return (
    <div
      key={ObjList.id}
      className={clsx("p-4 cursor-default hover:bg-secondary", {
      })}
    >
      <CardContent>
        <h2 className="text-lg font-bold"><LucideBanknote />{ObjList.nome}</h2>
        {ObjList.saldo > 0 ? (
          <p className="text-2xl font-semibold">{formatReal(ObjList.saldo)}</p>
        ) : (
          <p className="text-2xl font-semibold text-red-500 ">
            {formatReal(ObjList.saldo)}
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
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex flex-row gap-1 text-2xl uppercase font-bold items-center">
        <Wallet />{titulo}
      </h2>
      <div className="flex flex-row flex-wrap items-end gap-2 bg-black rounded-md border-white">
        {objetos?.map((obj: CardSaldosProps) => (
          <CardSaldos key={obj.id} {...obj} />
        ))}
      </div>
    </section>
  );
};
