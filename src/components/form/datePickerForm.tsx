"use client";

import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { locale, addLocale } from "primereact/api";

interface Props {
  setFunc: (date: Date | null) => void;
  className: string
}

export function DatePickerForm({ setFunc, className }: Props) {
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

  function atualizarData(e: Date ) {
    setFunc(e);
    setDate(e);
  }

  return (
    <div className={className}>
      <Calendar
        showIcon
        value={date}
        onChange={(e) => atualizarData(e.value ?? new Date())}
        className={className}
        placeholder="Data"
      />
    </div>
  );
}
