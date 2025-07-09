import Image from "next/image";
import { Button } from "../components/UI/button";
import img from "../../public/logos/brancaFVP.png";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center py-12 space-y-6">
      <div className="w-48 sm:w-auto h-auto">
        <Image
          src={img}
          alt="Logo da Igreja Família Vida e Paz"
          width={384} 
          height={384}
          priority
        />
      </div>

      <Button size="lg" className="mt-4" asChild>
        <a href="/login">Entrar</a>
      </Button>
    </main>
  );
}
