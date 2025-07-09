import { Loader2 } from "lucide-react";

import Logo64 from "../../../public/logos/logo25.png";
import miniLogoImg from "../../../public/logos/logo_64.png";
import Image from "next/image";

export function Loading() {
  return (
    <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-black z-50">
      <div className="flex flex-col items-center ">
        <Image
          src={Logo64}
          alt="Logo"
          priority
          width={200}
          height={200}
          className="z-50 mb-10 "
        />
        <div className="flex flex-row gap-4">
          <Loader2 size={25} className="text-white animate-spin" />
          <span className="text-white">Carregando...</span>
        </div>
      </div>
    </div>
  );
}

export function Carregando() {
  return (
    <>
      <p className="text-center text-gray-500">Carregando...</p>;
    </>
  );
}

export function MiniLoading() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Imagem de fundo */}
        <Image
          src={miniLogoImg}
          alt="Mini Logo De Carregamento"
          width={32}
          height={32}
          className="absolute top-0 left-0 z-0 animate-bounce"
          quality={50}
          priority
        />

        {/* Ícone de loading girando sobre a imagem */}
      </div>
    </div>
  );
}

export function LogoCarregando() {
  return (
    <div className="flex flex-row gap-1">
      <MiniLoading /> Carregando dados...
    </div>
  );
}
