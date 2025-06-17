"use client";

import { LogoCarregando, MiniLoading } from "@/components/loading";
import { Button } from "@/components/UI/button";
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
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Validar from "./_compnente/validar";
import Link from "next/link";

type Arquivo = {
  id: number;
  link: string;
  tipo: string;
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

export default function Page() {
  const [dados, setDados] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getDados() {
    try {
      const response = await ApiNovo(
        `financeiro/formulario/formulario-entrada/`
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

  useEffect(() => {
    getDados();
  }, []);

  useEffect(() => {
    if (reload) {
      getDados();
      setReload(false);
    }
  }, [reload]);

  if (loading) return <LogoCarregando />;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Entradas Registradas no Formulário</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Dinheiro</TableHead>
            <TableHead>Pix</TableHead>
            <TableHead>Cartão</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map((item, index) => (
            <TableRow>
              <TableCell>
                <Link key={index} href={`/app/formulario/entrada/${item.id}/`}>
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
                <Validar item={item} onValidated={() => setReload(true)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
