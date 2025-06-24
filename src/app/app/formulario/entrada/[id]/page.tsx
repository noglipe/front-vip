"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText } from "lucide-react";
import Link from "next/link";
import { ApiNovo } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { formatData, formatReal } from "@/lib/utils";
import { LogoCarregando } from "@/components/loading";
import Validar from "../_compnente/validar";

type Arquivo = {
  id: number;
  link: string;
  tipo: string;
};

interface FormularioEntrada {
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
}

export default function VisualizarEntradaPage() {
  const { id } = useParams();
  const [reload, setReload] = useState(false);
  const [dados, setDados] = useState<FormularioEntrada | null>(null);

  async function carregar() {
    const response = await ApiNovo(
      `financeiro/formulario/formulario-entrada/${id}`
    );
    const json = await response.json();
    setDados(json);
  }

  useEffect(() => {
    if (!id) return;

    carregar();
  }, [id]);

  useEffect(() => {
    if (reload) {
      carregar();
      setReload(false);
    }
  }, [reload]);

  if (!dados) return <LogoCarregando />;

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <h1 className="text-xl font-bold">Entrada #{dados.id}</h1>
            {dados.validado ? (
              <Badge className="bg-green-500">Validado</Badge>
            ) : (
              <Badge className="bg-red-500">Não Validado</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          <div>
            <strong>Data:</strong> {formatData(dados.data)}
          </div>
          <div>
            <strong>Total:</strong>{" "}
            {formatReal(
              Number(dados.dinheiro) + Number(dados.pix) + Number(dados.cartao)
            )}
          </div>
          <div>
            <strong>Categoria:</strong> {dados.categoria}
          </div>
          <div>
            <strong>Descrição:</strong> {dados.descricao.toUpperCase()}
          </div>
          <Card>
            <CardContent>
              {dados.dinheiro && (
                <div>
                  <strong>Dinheiro:</strong> {formatReal(dados.dinheiro)}
                </div>
              )}
              {dados.pix && (
                <div>
                  <strong>Pix:</strong> {formatReal(dados.pix)}
                </div>
              )}
              {dados.cartao && (
                <div>
                  <strong>Cartao:</strong> {formatReal(dados.cartao)}
                </div>
              )}
            </CardContent>
          </Card>

          <h2 className="text-lg font-semibold mt-4">Arquivos Relacionados</h2>
          {dados.arquivos && dados.arquivos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dados.arquivos.map((arquivo) => (
                <Card key={arquivo.id}>
                  <CardContent className="flex items-center gap-2 p-4">
                    <FileText className="text-blue-500" />
                    <div className="flex flex-col">
                      <Link
                        href={arquivo.link}
                        target="_blank"
                        className="text-sm underline text-blue-600"
                      >
                        Arquivo #{arquivo.id}
                      </Link>
                      <Badge variant="secondary">Tipo {arquivo.tipo}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>Nenhum arquivo relacionado.</p>
          )}
          {!dados.validado && (
            <div className="flex justify-end">
              <Validar item={dados} onValidated={() => setReload(true)} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
