import { StepBack } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import logoImg from "../../public/logos/logo.png";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-2">
      <Link href="/" className="flex items-center justify-center">
        <Image src={logoImg} alt="logomarca" quality={100} className="w-2/4" />
      </Link>

      <div className="text-center text-gray-800 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold">Página Não Encontrada</h2>
        <Link
          href="/"
          className="text-2xl flex flex-row items-center justify-center"
        >
          <span className="flex flex-row text-center items-center justify-center text-red-500 font-bold">
            <StepBack />
            Retorne para início
          </span>
        </Link>
      </div>
    </div>
  );
}
