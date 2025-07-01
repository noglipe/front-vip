"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/UI/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { ApiNovo } from "@/lib/api";
import { formatData, formatReal } from "@/lib/utils";
import { CheckCircle, File, Table2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Arquivo = {
  id: number;
  link_temporario: string;
  tipo: string;
};

type I = {
  id: number;
  nome: string;
};

type Item = {
  id: number;
  data: string;
  descricao: string;
  tipo: string;
  valor: number;
  autorizado_por: string;
  picpay: string;
  cartao: I;
  categoria: I;
  validado: boolean;
  arquivos?: Arquivo[];
  meio_pagamento: I;
};

interface Obj {
  count: number;
  page_size: number;
  page: number;
  registros: Item[];
  total_pages: number;
}

export default function Page() {
  const [dados, setDados] = useState<Obj | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    async function getDados() {
      try {
        const response = await ApiNovo(
          `financeiro/formulario/formulario-compra/`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const json = await response.json();
        setDados(json);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    getDados();


  }, []);

  if (loading) return <div>Carregando dados...</div>;
  if (error) return <div>Erro: {error}</div>;

  const handlePageChange = async (page: number) => {
    try {
      const response = await ApiNovo(
        `financeiro/formulario/formulario-compra/?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      const json = await response.json();
      setDados(json);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Entradas Registradas no Formulário</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>

            <TableHead>Meio de Pagamento</TableHead>
            <TableHead>Arquivos</TableHead>
            <TableHead>Validado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados &&
            dados.registros.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="flex gap-1">
                  <Link href={`/app/formulario/compra/${item.id}/`}>
                    <Table2 />
                  </Link>
                  {formatData(item.data)}
                </TableCell>
                <TableCell>{item.descricao.toUpperCase()}</TableCell>
                <TableCell>{item.tipo.toUpperCase()}</TableCell>
                <TableCell>{item.categoria?.nome}</TableCell>
                <TableCell>{formatReal(item.valor)}</TableCell>

                <TableCell>
                  {item.meio_pagamento && item.meio_pagamento.nome}
                </TableCell>
                <TableCell>
                  {item.arquivos && item.arquivos?.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <File className="text-green-500 inline-block " />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Arquivos</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.arquivos.map((a, index) => (
                          <Link
                            key={a.id}
                            href={a.link_temporario}
                            target="_blank"
                          >
                            <DropdownMenuItem>
                              {index + 1} - {a.tipo}
                            </DropdownMenuItem>
                          </Link>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>

                <TableCell className="">
                  {item.validado ? (
                    <CheckCircle className="text-green-500 inline-block " />
                  ) : (
                    <XCircle className="text-red-500 inline-block " />
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          {dados && dados.page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(dados.page - 1)}
              />
            </PaginationItem>
          )}

          {dados && dados.total_pages <= 5 ? (
            // CASO COM POUCAS PÁGINAS (todas visíveis)
            [...Array(dados.total_pages)].map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(idx + 1)}
                  className={
                    dados.page === idx + 1
                      ? "bg-gray-800 border border-gray-700 rounded-sm"
                      : ""
                  }
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          ) : (
            // CASO COM MUITAS PÁGINAS
            <>
              {/* Primeira página sempre visível */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(1)}
                  className={
                    dados?.page === 1
                      ? "bg-gray-800 border border-gray-700 rounded-sm"
                      : ""
                  }
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis se a página atual for depois da terceira */}
              {dados && dados.page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Páginas ao redor da atual */}
              {dados &&
                [dados.page - 1, dados.page, dados.page + 1].map((p) => {
                  if (p > 1 && p < dados.total_pages) {
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(p)}
                          className={
                            dados.page === p
                              ? "bg-gray-800 border border-gray-700 rounded-sm"
                              : ""
                          }
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

              {/* Ellipsis antes da última página */}
              {dados && dados.page < dados.total_pages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Última página sempre visível */}
              {dados && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(dados.total_pages)}
                    className={
                      dados.page === dados.total_pages
                        ? "bg-gray-800 border border-gray-700 rounded-sm"
                        : ""
                    }
                  >
                    {dados.total_pages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          )}

          {dados && dados.page < dados.total_pages && (
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(dados.page + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
