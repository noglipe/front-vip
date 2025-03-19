"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/UI/sidebar";

import { Banknote } from "lucide-react";

import logoImagem from "../../../../public/logos/logo.png";
import Image from "next/image";
import { LogOut } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

const menuLista = [
  {
    nome: "Receita",
    link: "/app/transacoes/receita",
  },
  {
    nome: "Despesa",
    link: "/",
  },
  {
    nome: "Transações",
    link: "/",
  },
  {
    nome: "Fornecedor",
    link: "/app/fornecedores",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
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
        <Collapsible className="p-4 w-full ">
          <CollapsibleTrigger className="w-full cursor-pointer text-left flex gap-2">
            <Banknote /> Financeiro
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 ml-5 ">
            <div className="flex flex-col w-full ">
              {menuLista.map((item, index) => (
                <Link
                  className="w-full hover:bg-accent hover:shadow p-4"
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
      <SidebarFooter className="bg-red-800 text-white">
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
