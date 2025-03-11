import { Loader2 } from "lucide-react";
import { Logo64, LogoMedida } from "../logo";

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
    <div className="flex flex-row gap-1">
      <LogoMedida tamanho={25} />
      <Loader2 size={25} className="text-white animate-spin" />
    </div>
  );
}
