"use client";

import { decryptData } from "@/lib/crip";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerificarAdmin() {
  const router = useRouter();

  useEffect(() => {
    const obterPerfil = async () => {
      const dadosCriptografados = localStorage.getItem("data");
      const perfil = await decryptData(dadosCriptografados)?.perfil;

      if (perfil !== "Administrador") {
        alert("Usuário sem Permissão");
        router.push("/app/");
      }
    };
    obterPerfil();
  }, []);

  return <div></div>;
}
