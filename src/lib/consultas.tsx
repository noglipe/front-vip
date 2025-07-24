"use client";

import { useQuery } from "@apollo/client";
import { CATEGORIAS_FORM_QUERY } from "@/graphql/query";
import client from "./apollo-client";
import { toast } from "sonner";

interface SelectApi {
  id: string;
  nome: string;
}

export function useCategorias() {
  const { loading, error, data } = useQuery<{ categorias: SelectApi[] }>(
    CATEGORIAS_FORM_QUERY,
    { client }
  );

  if (error) {
    toast.error(`Erro ao buscar categorias: ${error}`);
    throw new Error(`Erro ao buscar categorias: ${error}`);
  }

  return {
    categorias: data?.categorias || [],
  };
}
