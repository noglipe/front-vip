import { Button } from "../components/UI/button";

export default function Home() {
  return (
    <main className="flex flex-col h-screen items-center justify-center py-12 space-y-6">
      <h1 className="text-4xl font-bold text-center">Bem-vindo à VipApp</h1>
      <p className="text-lg text-center">Entre para acessar.</p>
      <Button size="lg" className="mt-4" asChild>
        <a href="/login">Entrar</a>
      </Button>
    </main>
  );
}
