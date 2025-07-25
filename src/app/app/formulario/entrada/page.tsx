"use client";

import { LogoCarregando } from "@/components/loading";
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
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Validar from "./_compnente/validar";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/UI/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/UI/pagination";
import { decryptData } from "@/lib/crip";

type Arquivo = {
  id: number;
  link: string;
  tipo: string;
};

type Categoria = {
  id: number;
  nome: string;
};

type Item = {
  id: number;
  data: string;
  descricao: string;
  dinheiro: string;
  pix: string;
  picpay: string;
  cartao: string;
  categoria: string | null;
  validado: boolean;
  arquivos?: Arquivo[];
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
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [perfil, setPerfil] = useState("");

  async function getDados() {
    try {
      const response = await ApiNovo(
        `financeiro/formulario/formulario-entrada/`
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

  const obterPerfil = async () => {
    const dadosCriptografados = localStorage.getItem("data");
    setPerfil(await decryptData(dadosCriptografados)?.perfil);
  };

  useEffect(() => {
    getDados();
    obterPerfil();
  }, []);

  useEffect(() => {
    if (reload) {
      getDados();
      setReload(false);
    }
  }, [reload]);

  if (loading) return <LogoCarregando />;
  if (error) return <div>Erro: {error}</div>;

  const handlePageChange = async (page: number) => {
    if (!dados) return;

    setLoading(true);
    try {
      const response = await ApiNovo(
        `financeiro/formulario/formulario-entrada/?page=${page}`
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
    <Card className="p-4">
      <CardTitle>
        <h1>Formulário Entradas</h1>
        <CardDescription>Entradas Registradas no Formulário</CardDescription>
      </CardTitle>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Dinheiro</TableHead>
              <TableHead>Pix</TableHead>
              <TableHead>Cartão</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados?.registros &&
              dados.registros.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      key={index}
                      href={`/app/formulario/entrada/${item.id}/`}
                    >
                      {item.validado ? (
                        <CheckCircle className="text-green-500 inline-block " />
                      ) : (
                        <XCircle className="text-red-500 inline-block " />
                      )}{" "}
                      {formatData(item.data)}
                    </Link>
                  </TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{formatReal(item.dinheiro)}</TableCell>
                  <TableCell>{formatReal(item.pix)}</TableCell>
                  <TableCell>{formatReal(item.cartao)}</TableCell>
                  <TableCell>
                    {formatReal(
                      Number(item.dinheiro) +
                        Number(item.pix) +
                        Number(item.cartao)
                    )}
                  </TableCell>
                  {perfil === "Administrador" && !item.validado && (
                    <TableCell>
                      <Validar
                        item={item}
                        onValidated={() => setReload(true)}
                      />
                    </TableCell>
                  )}
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
      </CardContent>
    </Card>
  );
}
