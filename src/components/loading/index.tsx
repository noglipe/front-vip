import { Loader2 } from "lucide-react";
import { Logo64 } from "../logo";

import miniLogoImg from "../../../public/logos/logo_64.png";
import Image from "next/image";

export function Loading() {
  return (
    <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-black z-50">
      <div className="flex items-center space-x-2">
        <Logo64 />
        <Loader2 size={25} className="text-white animate-spin" />
        <span className="text-white">Carregando...</span>
      </div>
    </div>
  );
}

export function MiniLoading() {
  return (
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
  );
}
