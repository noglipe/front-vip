import { Card, CardContent } from "@/components/UI/card";
import { formatReal } from "@/lib/utils";
import { useEffect, useState } from "react";
import client from "../../../lib/apollo-client";
import { useQuery } from "@apollo/client";
import { CARTAO_MES_QUERY } from "@/graphql/query";
import { MiniLoading } from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { useRouter } from "next/navigation";
import { PAGINACAO_APP } from "@/lib/constantes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/UI/pagination";


interface comprasCartaoMes {
  transacoes: {
    id: string;
    descricao: string;
    data: string;
    valor: number;
    cartaoUtilizado: { nome: string; id: string };
    categoria: { nome: string; id: string };
  }[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPaginas: number;
  paginaAtual: number;
}

export default function ComprasCartaoMes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dados, setDados] = useState<comprasCartaoMes | null>(null);
  const router = useRouter();

  const [totalPagina, setTotalPagina] = useState(1);

  const { loading, error, data, refetch } = useQuery<{
    comprasCartaoMes: comprasCartaoMes;
  }>(CARTAO_MES_QUERY, {
    variables: {
      limite: PAGINACAO_APP,
      page: currentPage,
    },
    client,
  });

  useEffect(() => {
    if (data?.comprasCartaoMes) {
      setDados(data.comprasCartaoMes);
      setTotalPagina(data.comprasCartaoMes.totalPaginas);
    }
  }, [data]);

  if (loading) return <MiniLoading />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch;
  };

  const handleNextPage = () => {
    if (dados?.hasNextPage) {
      setCurrentPage(currentPage + 1);
      refetch;
    }
  };

  const handlePreviousPage = () => {
    if (dados?.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
      refetch;
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card className="p-4 col-span-full h-full">
        <CardContent>
          <h2 className="text-lg font-bold mb-4">
            Compras no Cartão do Mês Vigente
          </h2>
          <Table className="h-full">
            <TableHeader>
              <TableRow>
                <TableHead>data</TableHead>
                <TableHead>descricao</TableHead>
                <TableHead>valor</TableHead>
                <TableHead>cartaoUtilizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="h-full">
              {dados?.transacoes?.map((dado, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/app/transacoes/${dado.id}`)
                  }
                >
                  <TableCell>{dado.data}</TableCell>
                  <TableCell>
                    {dado.descricao} / {dado.categoria.nome}
                  </TableCell>
                  <TableCell>{formatReal(dado.valor)}</TableCell>
                  <TableCell>{dado.cartaoUtilizado.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              {dados?.hasPreviousPage && (
                <PaginationItem>
                  <PaginationPrevious onClick={handlePreviousPage} />
                </PaginationItem>
              )}
              {[...Array(totalPagina)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(idx + 1)}
                    className={currentPage === idx + 1 ? "active " : ""}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {dados?.hasNextPage && (
                <PaginationItem>
                  <PaginationNext onClick={handleNextPage} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
