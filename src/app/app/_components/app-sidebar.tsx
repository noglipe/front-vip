"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/UI/sidebar";

import {
  Banknote,
  CircleChevronDown,
  CircleChevronRight,
  Handshake,
  HomeIcon,
  LogOut,
} from "lucide-react";

import logoImagem from "../../../../public/logos/logo.png";
import Image from "next/image";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/UI/collapsible";
import { useState } from "react";
import { CLASS_SIDEBAR, CLASS_SIDEBAR_HOVER } from "@/lib/constantes";

const menuLista = [
  { nome: "Receita", link: "/app/transacoes/receita" },
  { nome: "Despesa", link: "/app/transacoes/despesa" },
  { nome: "Transações", link: "/app/transacoes" },
  { nome: "Fornecedor", link: "/app/fornecedores" },
];

const menuRelatorio = [
  { nome: "Categoria", link: "/app/transacoes/categoria" },
  { nome: "Dia", link: "/app/transacoes/dia" },
  { nome: "Período", link: "/app/transacoes/periodo" },
  { nome: "Ultimos Cadastros", link: "/app/transacoes/ultimos-cadastros" },
  { nome: "Filtros", link: "/app/transacoes/filtros" },
];

export function AppSidebar() {
  const [isOpenFinanceiro, setIsOpenFinanceiro] = useState(false);
  const [isOpenRelatorio, setIsOpenRelatorio] = useState(false);

  return (
    <Sidebar className="print:hidden">
      <div className="flex flex-row gap-2 p-4 items-center border-b-2">
        <Image
          src={logoImagem}
          alt="Logo Marca"
          className="w-14 h-14 shadow-md rounded-full"
          quality={100}
          priority
        />
        <div className="flex flex-col space-y-0">
          <p className="font-bold p-0 text-md">Família Vida e Paz</p>
          <p className="text-sm">Usuário:</p>
          <p className="text-sm">Email:</p>
        </div>
      </div>

      <SidebarHeader />
      <SidebarContent>
        <div className="p-2 w-full space-y-1">
          <Link href="/app/" className={CLASS_SIDEBAR + " flex flex-row gap-2"}>
            <HomeIcon /> Home
          </Link>

          <Link
            href="/app/termo-doacao"
            className={CLASS_SIDEBAR + " flex flex-row gap-2"}
          >
            <Handshake /> Termo de Doação
          </Link>

          {/* Financeiro */}
          <Collapsible
            open={isOpenFinanceiro}
            onOpenChange={setIsOpenFinanceiro}
          >
            <CollapsibleTrigger
              className={CLASS_SIDEBAR + " flex flex-row justify-between"}
            >
              <div className="flex flex-row gap-2">
                <Banknote /> Financeiro
              </div>
              {isOpenFinanceiro ? (
                <CircleChevronDown size={20} className="mr-2" />
              ) : (
                <CircleChevronRight size={20} className="mr-2" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-5">
              <div className="flex flex-col w-full">
                {menuLista.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className={CLASS_SIDEBAR_HOVER + " w-full p-4"}
                  >
                    {item.nome}
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Relatórios */}
          <Collapsible open={isOpenRelatorio} onOpenChange={setIsOpenRelatorio}>
            <CollapsibleTrigger
              className={CLASS_SIDEBAR + " flex flex-row justify-between"}
            >
              <div className="flex flex-row gap-2">
                <Banknote /> Relatórios
              </div>
              {isOpenRelatorio ? (
                <CircleChevronDown size={20} className="mr-2" />
              ) : (
                <CircleChevronRight size={20} className="mr-2" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-5">
              <div className="flex flex-col w-full">
                {menuRelatorio.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className={CLASS_SIDEBAR_HOVER + " w-full p-4"}
                  >
                    {item.nome}
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </SidebarContent>

      <SidebarFooter className="text-red-200">
        <SidebarMenu>
          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-red-600 rounded">
            <LogOut size={20} />
            <span>Sair</span>
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
