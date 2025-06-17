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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { ApiNovo } from "@/lib/api";
import { formatData, formatReal } from "@/lib/utils";
import { CheckCircle, File, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Arquivo = {
  id: number;
  link: string;
  tipo: string;
};

type Item = {
  id: number;
  data: string;
  descricao: string;
  tipo:string;
  valor: number;
  autorizado_por: string;
  picpay: string;
  cartao: string;
  categoria: string | null;
  validado: boolean;
  arquivos?: Arquivo[];
  meio_pagamento:string
};

export default function Page() {
  const [dados, setDados] = useState<Item[]>([]);
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
        console.log(json);
        setDados(json.items);
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
          {dados.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{formatData(item.data)}</TableCell>
              <TableCell>{item.descricao.toUpperCase()}</TableCell>
              <TableCell>{item.tipo.toUpperCase()}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{formatReal(item.valor)}</TableCell>
         
              <TableCell>{item.meio_pagamento}</TableCell>
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
                        <Link key={a.id} href={a.link} target="_blank">
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
    </div>
  );
}
