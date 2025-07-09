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
  FormInput,
  Handshake,
  HomeIcon,
  LogOut,
  NotepadText,
} from "lucide-react";

import logoImagem from "../../../../public/logos/logo25.png";
import Image from "next/image";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/UI/collapsible";
import { use, useEffect, useState } from "react";
import { CLASS_SIDEBAR, CLASS_SIDEBAR_HOVER } from "@/lib/constantes";
import { decryptData } from "@/lib/crip";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/navigation";

const menuLista = [
  { nome: "Receita", link: "/app/transacoes/receita" },
  { nome: "Despesa", link: "/app/transacoes/despesa" },
  { nome: "Transações", link: "/app/transacoes" },
  { nome: "Fornecedor", link: "/app/fornecedores" },
];

const menuRelatorio = [
  { nome: "Anual", link: "/app/transacoes/relatorio/anual" },
  { nome: "Categoria", link: "/app/transacoes/relatorio/categoria" },
  { nome: "Dia", link: "/app/transacoes/relatorio/dia" },
  { nome: "Período", link: "/app/transacoes/relatorio/periodo" },
  {
    nome: "Ultimos Cadastros",
    link: "/app/transacoes/relatorio/ultimos-cadastros",
  },
  { nome: "Filtros", link: "/app/transacoes/relatorio/filtros" },
];

const menuFormulario = [
  { nome: "Registrar Compra", link: "/app/formulario/compra/cadastro" },
  { nome: "Visualizar Compra", link: "/app/formulario/compra/" },
  { nome: "Registrar Entrada", link: "/app/formulario/entrada/cadastro" },
  { nome: "Visualizar Entrada", link: "/app/formulario/entrada/" },
];

export function AppSidebar() {
  const [isOpenFinanceiro, setIsOpenFinanceiro] = useState(false);
  const [isOpenRelatorio, setIsOpenRelatorio] = useState(false);
  const [isOpenFormulario, setIsOpenFormulario] = useState(false);
  const [nome, setNome] = useState("");
  const [id, setId] = useState(0);
  const [perfil, setPerfil] = useState("");
  const router = useRouter();

  useEffect(() => {
    const obterDados = async () => {
      const dadosCriptografados = localStorage.getItem("data");
      setNome(await decryptData(dadosCriptografados)?.nome);
      setId(await decryptData(dadosCriptografados)?.idUser);
      setPerfil(await decryptData(dadosCriptografados)?.perfil);
    };
    obterDados();
  }, []);

  return (
    <Sidebar className="print:hidden border-none">
      <div className="flex flex-row gap-2 p-4 items-center ">
        <Image
          src={logoImagem}
          alt="Logo Marca"
          className="w-14 h-14 shadow-md rounded-full"
          quality={100}
          priority
        />
        <div className="flex flex-col gap-0">
          <p className="font-bold [14px]">Vida e Paz</p>
          <p className="text-[12px] text-sm">{nome}</p>
          <p className="text-[10px] font-bold">{perfil}</p>
        </div>
      </div>

      <SidebarHeader />
      <SidebarContent>
        <div className="p-2 w-full space-y-1">
          {/* Menu Home e Termo de Doação sempre visíveis */}
          <Link href="/app/" className={CLASS_SIDEBAR + " flex flex-row gap-2"}>
            <HomeIcon /> Home
          </Link>

          {perfil === "Administrador" && (
            <Link
              href="/app/termo-doacao"
              className={CLASS_SIDEBAR + " flex flex-row gap-2"}
            >
              <Handshake /> Termo de Doação
            </Link>
          )}

          {/* Condicional: Exibe todos os menus se for admin, ou apenas o de Formulários se for 'formulario' */}
          {perfil === "Administrador" && (
            <>
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
              <Collapsible
                open={isOpenRelatorio}
                onOpenChange={setIsOpenRelatorio}
              >
                <CollapsibleTrigger
                  className={CLASS_SIDEBAR + " flex flex-row justify-between"}
                >
                  <div className="flex flex-row gap-2">
                    <NotepadText /> Relatórios
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
            </>
          )}

          {perfil !== "Administrador" && perfil !== "Formulário" && (
            <p>Sem permissão para acessar essas áreas.</p>
          )}

          {/* Apenas exibe o Formulário se for o perfil 'formulario' */}
          {(perfil === "Formulário" || perfil === "Administrador") && (
            <Collapsible
              open={isOpenFormulario}
              onOpenChange={setIsOpenFormulario}
            >
              <CollapsibleTrigger
                className={CLASS_SIDEBAR + " flex flex-row justify-between"}
              >
                <div className="flex flex-row gap-2">
                  <FormInput /> Formulários
                </div>
                {isOpenFormulario ? (
                  <CircleChevronDown size={20} className="mr-2" />
                ) : (
                  <CircleChevronRight size={20} className="mr-2" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 ml-5">
                <div className="flex flex-col w-full">
                  {menuFormulario.map((item, index) => (
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
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className="text-red-200">
        <SidebarMenu>
          <Button
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-red-600 rounded"
            onClick={() => {
              localStorage.removeItem("data");
              router.push("/");
            }}
          >
            <LogOut size={20} />
            <span>Sair</span>
          </Button>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
