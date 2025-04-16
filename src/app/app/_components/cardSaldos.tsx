import { Card, CardContent } from "@/components/UI/card";
import { formatReal } from "@/lib/utils";
import clsx from "clsx";

export function CardSaldos(ObjList: CardSaldosProps) {
  return (
    <Card
      key={ObjList.id}
      className={clsx("p-4 cursor-default hover:bg-secondary", {
        "border-red-300": ObjList.saldo <= 0,
        "border-green-100": ObjList.saldo > 0,
        "border-green-200": ObjList.saldo > 100,
        "border-green-300": ObjList.saldo > 1000,
      })}
    >
      <CardContent>
        <h2 className="text-lg font-bold">{ObjList.nome}</h2>
        {ObjList.saldo > 0 ? (
          <p className="text-2xl font-semibold">{formatReal(ObjList.saldo)}</p>
        ) : (
          <p className="text-2xl font-semibold text-red-500 ">
            {formatReal(ObjList.saldo)}
          </p>
        )}
      </CardContent>
    </Card>
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
    <section className="flex flex-wrap gap-4 justify-between items-center ">
      <h2 className="text-2xl uppercase font-bold text-muted-foreground">
        {titulo}
      </h2>
      <div className="flex flex-row flex-wrap items-end gap-2">
        {objetos?.map((obj: CardSaldosProps) => (
          <CardSaldos key={obj.id} {...obj} />
        ))}
      </div>
    </section>
  );
};
