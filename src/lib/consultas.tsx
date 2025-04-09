"use client";

import { useQuery } from "@apollo/client";
import { CATEGORIAS_FORM_QUERY } from "@/graphql/query";
import client from "./apollo-client";

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
    console.error("Erro ao buscar categorias:", error);
  }

  return {
    categorias: data?.categorias || [],
  };
}
