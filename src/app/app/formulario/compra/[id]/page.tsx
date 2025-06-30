"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BadgeCheck, CreditCard, FileText } from "lucide-react";
import { ApiNovo } from "@/lib/api";
import {  formatReal } from "@/lib/utils";
import { LogoCarregando } from "@/components/loading";


export interface Item {
  id: number;
  nome: string;
}

export interface Arquivo {
  id: number;
  tipo: number | null;
  link: string;
}

export interface FormularioCompra {
  id: number;
  data: string; // yyyy-mm-dd
  tipo: string;
  categoria: Item | null;
  descricao: string;
  autorizado_por: string | null;
  meio_pagamento: Item | null;
  cartao: Item | null;
  compra_parcelara: boolean;
  observacao: string | null;
  valor: number;
  valor_parcela: number;
  quantidade_parcela: number;
  valor_frete: number;
  arquivos: Arquivo[];
  validado: boolean;
}

export default function VisualizarEntradaPage() {
  const { id } = useParams();
  const [reload, setReload] = useState(false);
  const [compra, setDados] = useState<FormularioCompra | null>(null);

  async function carregar() {
    const response = await ApiNovo(
      `financeiro/formulario/formulario-compra/${id}/`
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

  if (!compra) return <LogoCarregando />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Detalhes da Compra #{compra?.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap- rounded-xl p-4 shadow-md">
        <Item titulo="Data" valor={compra?.data} />
        <Item titulo="Tipo" valor={compra?.tipo} />
        <Item titulo="Categoria" valor={compra?.categoria?.nome} />
        <Item titulo="Descrição" valor={compra?.descricao} />
        <Item titulo="Autorizado por" valor={compra?.autorizado_por} />
        <Item titulo="Meio de Pagamento" valor={compra?.meio_pagamento?.nome} />
        <Item
          titulo="Cartão"
          valor={compra?.cartao?.nome}
          icon={<CreditCard className="w-4 h-4 inline" />}
        />
        <Item
          titulo="Compra Parcelada"
          valor={compra?.compra_parcelara ? "Sim" : "Não"}
        />
        <Item titulo="Valor Total" valor={formatReal(compra.valor)} />
        <Item
          titulo="Valor da Parcela"
          valor={formatReal(compra.valor_parcela)}
        />
        <Item
          titulo="Quantidade de Parcelas"
          valor={compra?.quantidade_parcela}
        />
        <Item titulo="Valor do Frete" valor={formatReal(compra.valor_frete)} />
        <Item titulo="Observação" valor={compra?.observacao} />
        <Item
          titulo="Validado"
          valor={compra?.validado ? "Sim" : "Não"}
          icon={
            <BadgeCheck
              className={`inline w-4 h-4 ${
                compra?.validado ? "text-green-500" : "text-red-500"
              }`}
            />
          }
        />
      </div>

      <div>
        <h2 className="font-semibold text-lg mt-6 mb-2">Arquivos Anexados</h2>
        <ul className="space-y-2">
          {compra?.arquivos.map((arq: any) => (
            <li
              key={arq.id}
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FileText className="w-4 h-4" />
              <a href={arq.link} target="_blank">
                Arquivo #{arq.id}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Item({
  titulo,
  valor,
  icon,
}: {
  titulo: string;
  valor: any;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm">{titulo}</span>
      <span className="font-medium">
        {icon} {valor || "-"}
      </span>
    </div>
  );
}
