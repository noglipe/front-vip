"use client";

import Saldos from "./_components/saldos";
import NConclidas from "./_components/nConcluidas";
import ComprasCartaoMes from "./_components/comprasCartaoMes";
import { Card } from "@/components/UI/card";
import { useEffect, useState } from "react";
import { decryptData } from "@/lib/crip";
import Image from "next/image";
import logo from "../../../public/logos/brancaFVP.png"

export default function DashboardFinanceiro() {
  const [perfil, setPerfil] = useState("");

  useEffect(() => {
    const obterDados = async () => {
      const dadosCriptografados = localStorage.getItem("data");
      setPerfil(await decryptData(dadosCriptografados)?.perfil);
    };
    obterDados();
  }, []);

  return (
    <section className="w-full p-0 h-full">
      {perfil === "Administrador" ? (
        <Card className="p-1 flex flex-col gap-2 ">
          <Saldos />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl">
            <ComprasCartaoMes />
            <NConclidas />
          </div>
        </Card>
      ) : (
        <div className="w-full p-4 mt-24">
        <Image
        src={logo}
        alt="Logo"
        />
        </div>
      )}
    </section>
  );
}
