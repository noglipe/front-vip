"use client";

import { decryptData } from "@/lib/crip";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function VerificarLogin() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    
    const verificar = async () => {
      try {
        const dadosCriptografados = localStorage.getItem("data");
        const token = await decryptData(dadosCriptografados)?.access;

        if (token) {
          const url = localStorage.getItem("RefreshLocal");
          localStorage.removeItem("RefreshLocal");
          url && router.push(url);
        }
      } catch (error) {
        localStorage.setItem("RefreshLocal", pathname);
        router.push("/login");
      }
    };

    verificar();
  }, [router]);

  return null;
}
