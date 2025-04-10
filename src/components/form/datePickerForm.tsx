"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
import { Button } from "../UI/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../UI/calendar";

import { ptBR } from "date-fns/locale";

interface Props {
  setFunc: (date: any) => void;
  className: string;
  descricao?: string | null ;
  date?: any
}

export function DatePickerForm({ setFunc, className, descricao, date }: Props) {

  function handleData(e: Date) {
    if (e) {
      setFunc(e);
    }
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            " justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "dd/MM/yyyy") : descricao ? descricao : <span>Seleciona a Data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => handleData(e as any)}
          initialFocus
          className="rounded-md border"
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
