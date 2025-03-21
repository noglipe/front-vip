"use client";

import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { locale, addLocale } from "primereact/api";

interface Props {
  setFunc: (data: Date | null) => void;
}

export function DatePickerForm({ setFunc }: Props) {
  const [date, setDate] = useState<Date | null>(null);

  addLocale("brvip", {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ],
    dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
    dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
    monthNames: [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ],
    monthNamesShort: [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ],
    today: "Hoy",
    clear: "Limpiar",
    //...
  });

  locale("brvip");

  function atualizarData(e: Date | null) {
      setFunc(e);
      setDate(e);
  }

  return (
    <>
      <Calendar showIcon value={date} onChange={(e) => atualizarData(e.value)} className="" />
    </>
  );
}
