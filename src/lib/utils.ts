import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatReal(value: any) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return formatter.format(value);
}

export function formatData(value: any, extenso: boolean = false) {
  if (value) {
    const [ano, mes, dia] = value
      .split("-")
      .map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    if (extenso) {
      return format(dataObj, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else { return dataObj.toLocaleDateString("pt-BR") }
  }
  return " "
}