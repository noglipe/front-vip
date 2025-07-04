"use client";

import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
import { Button } from "../UI/button";
import { format, parse, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../UI/calendar";
import { Input } from "../UI/input";

interface Props {
  setFunc: (date: Date | undefined) => void;
  className?: string;
  descricao?: string | null;
  date?: Date | string | undefined;
}

export function DatePickerForm({ setFunc, className, descricao, date }: Props) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!date) {
      setInputValue("");
      return;
    }

    let d: Date;

    if (typeof date === "string") {
      d = parseISO(date);
    } else {
      d = date;
    }

    if (isValid(d)) {
      setInputValue(format(d, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);

    const parsed = parse(value, "dd/MM/yyyy", new Date());
    if (isValid(parsed)) {
      setFunc(parsed);
    } else {
      setFunc(undefined);
    }
  }

  function handleData(selectedDate: Date | undefined) {
    if (selectedDate && isValid(selectedDate)) {
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
      setFunc(selectedDate);
    }
  }

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="dd/mm/aaaa"
        className="border rounded-md px-3 py-2 text-sm"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="p-2" type="button">
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={
              typeof date === "string"
                ? parseISO(date)
                : isValid(date)
                ? date
                : undefined
            }
            onSelect={handleData}
            initialFocus
            className="rounded-md border"
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
