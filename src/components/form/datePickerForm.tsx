"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
import { Button } from "../UI/button";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../UI/calendar";

interface Props {
  setFunc: (date: any) => void;
  className?: string;
  descricao?: string | null;
  date?: any;
}

export function DatePickerForm({ setFunc, className, descricao, date }: Props) {
  const [inputValue, setInputValue] = useState(
    date ? format(date, "dd/MM/yyyy") : ""
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);

    const parsed = parse(value, "dd/MM/yyyy", new Date());
    if (!isNaN(parsed.getTime())) {
      setFunc(parsed);
    }
  }

  function handleData(e: Date | undefined) {
    if (e) {
      setInputValue(format(e, "dd/MM/yyyy"));
      setFunc(e);
    }
  }

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="dd/mm/aaaa"
        className="border rounded-md px-3 py-2 w-[140px] text-sm"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="p-2">
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(e) => handleData(e as Date)}
            initialFocus
            className="rounded-md border"
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
