"use client";

import { useQuery } from "@apollo/client";
import { TRANSACOES_MES_QUERY } from "@/graphql/query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/UI/table";
import { Card, CardContent } from "@/components/UI/card";
import { Loading } from "@/components/loading";
import { formatData, formatReal } from "@/lib/utils";
import { useEffect, useState } from "react";
import client from "../../../lib/apollo-client";
import {
  EyeIcon,
  FilterIcon,
  Printer,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { IfConcluidoCircle } from "./_components/ifConcluido";

interface TransacoesMes {
  totalDespesas: number;
  totalReceitas: number;
  transacoes: {
    id: string;
    receita: boolean;
    transacaoConcluido: boolean;
    data: string;
    descricao: string;
    valor: number;
    categoria: {
      id: string;
      nome: string;
    };
    meioDeTransacao: {
      id: string;
      nome: string;
    };
    instituicaoFinanceira?: {
      id: string;
      nome: string;
    };
  }[];
}

export default function Page() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("");

  const [dados, setDados] = useState<TransacoesMes | null>(null);

  const [termoDeBusca, setTermoDeBusca] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");

  const { loading, error, data } = useQuery<{ transacoesMes: TransacoesMes }>(
    TRANSACOES_MES_QUERY,
    { client }
  );

  useEffect(() => {
    if (data?.transacoesMes) {
      setDados(data.transacoesMes);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error)
    return <p className="text-center text-red-500">Erro: {error.message}</p>;

  const diferenca = (dados?.totalReceitas || 0) + (dados?.totalDespesas || 0);

  const filtrarTransacoes = dados?.transacoes.filter((transacao) => {
    const matchBusca =
      transacao.descricao.toLowerCase().includes(termoDeBusca.toLowerCase()) ||
      transacao.categoria.nome
        .toLowerCase()
        .includes(termoDeBusca.toLowerCase()) ||
      transacao.valor.toString().includes(termoDeBusca.toLowerCase());

    const matchesType =
      filterType === "todos" ||
      (filterType === "receitas" && transacao.receita === true) ||
      (filterType === "despesas" && transacao.receita === false);

    const matchCategoria = selectedCategory
      ? transacao.categoria.id.includes(selectedCategory)
      : true;

    return matchBusca && matchCategoria && matchesType;
  });

  const CLASS_RECEITA = "text-green-900 cursor-pointer";
  const CLASS_DESPESA = "text-red-900 cursor-pointer";

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {/* Totais Financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 bg-green-100">
            <CardContent>
              <h2 className="text-lg font-bold text-green-800">
                Total de Receitas
              </h2>
              <p className="text-3xl font-semibold">
                {formatReal(dados?.totalReceitas || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="p-4 bg-red-100">
            <CardContent>
              <h2 className="text-lg font-bold text-red-800">
                Total de Despesas
              </h2>
              <p className="text-3xl font-semibold">
                {formatReal(dados?.totalDespesas || 0)}
              </p>
            </CardContent>
          </Card>

          <Card
            className={`p-4 ${diferenca >= 0 ? "bg-green-200" : "bg-red-200"}`}
          >
            <CardContent>
              <h2
                className={`text-lg font-bold ${
                  diferenca >= 0 ? "text-green-800" : "text-red-800"
                }`}
              >
                Diferença (Lucro / Prejuízo)
              </h2>
              <p className="text-3xl font-semibold">{formatReal(diferenca)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Transações */}
        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-bold mb-4">
              Transações do Mês Vigente
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transações..."
                  className="pl-10"
                  value={termoDeBusca}
                  onChange={(e) => setTermoDeBusca(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">TODAS</SelectItem>
                    <SelectItem value="receitas">Receitas</SelectItem>
                    <SelectItem value="despesas">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição / Categoria</TableHead>
                  <TableHead>Meio de Pagamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrarTransacoes &&
                  filtrarTransacoes.map((transacao, index) => (
                    <TableRow
                      key={index}
                      className={
                        transacao.receita ? CLASS_RECEITA : CLASS_DESPESA
                      }
                    >
                      <TableCell className="flex flex-col justify-center items-center gap-1">
                        <IfConcluidoCircle
                          concluido={transacao.transacaoConcluido}
                        />
                        <div className="font-bold uppercase">
                          {transacao.receita ? "Receita" : "Despesa"}
                        </div>
                      </TableCell>
                      <TableCell>{formatData(transacao.data)}</TableCell>
                      <TableCell>
                        {transacao.descricao} / {transacao.categoria.nome}
                      </TableCell>
                      <TableCell>
                        {transacao.meioDeTransacao.nome} /{" "}
                        {transacao.instituicaoFinanceira?.nome || "N/A"}
                      </TableCell>
                      <TableCell>{formatReal(transacao.valor)}</TableCell>
                      <TableCell className="flex flex-row gap-2 items-center justify-center">
                        <Button
                          onClick={() =>
                            router.push(`/app/transacoes/${transacao.id}`)
                          }
                        >
                          <EyeIcon className="mr-2" size={16} /> Visualizar
                        </Button>
                        <Button
                          onClick={() =>
                            router.push(
                              `/app/transacoes/recibo/${transacao.id}`
                            )
                          }
                        >
                          <Printer className="mr-2" size={16} /> Recibo
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
