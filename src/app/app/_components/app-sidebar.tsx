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
} from "lucide-react";

import logoImagem from "../../../../public/logos/logo.png";
import Image from "next/image";
import { LogOut } from "lucide-react";

import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/UI/collapsible";
import { useState } from "react";
import { CLASS_SIDEBAR, CLASS_SIDEBAR_HOVER } from "@/lib/constantes";

const menuLista = [
  {
    nome: "Receita",
    link: "/app/transacoes/receita",
  },
  {
    nome: "Despesa",
    link: "/app/transacoes/despesa",
  },
  {
    nome: "Transações",
    link: "/app/transacoes",
  },
  {
    nome: "Fornecedor",
    link: "/app/fornecedores",
  },
];

const menuRelatorio = [
  {
    nome: "Categoria",
    link: "/app/transacoes/relatorio/categoria",
  },
  {
    nome: "Despesa",
    link: "/app/transacoes/despesa",
  },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleToggle2 = () => setIsOpen(!isOpen2);

  return (
    <Sidebar className="print:hidden ">
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
        <Collapsible className="p-2 w-full ">
          <CollapsibleTrigger className={CLASS_SIDEBAR + " "}>
            <Link href={"/app/"} className="flex flex-row gap-2">
              <HomeIcon /> Home
            </Link>
          </CollapsibleTrigger>
          <CollapsibleTrigger className={CLASS_SIDEBAR}>
            <Link href={"/app/termo-doacao"} className="flex flex-row gap-2">
              <Handshake /> Termo de Doação
            </Link>
          </CollapsibleTrigger>
          <CollapsibleTrigger
            className={CLASS_SIDEBAR + " flex flex-row justify-between"}
            onClick={handleToggle}
          >
            <Link href={"/app/"} className="flex flex-row gap-2 ">
              <Banknote /> Financeiro
            </Link>
            {isOpen ? (
              <CircleChevronDown size={20} className={"mr-2"} />
            ) : (
              <CircleChevronRight className={" mr-2"} size={20} />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 ml-5 ">
            <div className="flex flex-col w-full ">
              {menuLista.map((item, index) => (
                <Link
                  className={CLASS_SIDEBAR_HOVER + " w-full p-4"}
                  key={index}
                  href={item.link}
                >
                  {item.nome}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible>
          <CollapsibleTrigger
            className={CLASS_SIDEBAR + " flex flex-row justify-between"}
            onClick={handleToggle2}
          >
            <Link href={"/app/"} className="flex flex-row gap-2 ">
              <Banknote /> Relatórios
            </Link>
            {isOpen2 ? (
              <CircleChevronDown size={20} className={"mr-2"} />
            ) : (
              <CircleChevronRight className={" mr-2"} size={20} />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 ml-5 ">
            <div className="flex flex-col w-full ">
              {menuRelatorio.map((item, index) => (
                <Link
                  className={CLASS_SIDEBAR_HOVER + " w-full p-4"}
                  key={index}
                  href={item.link}
                >
                  {item.nome}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className=" text-red-200">
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
