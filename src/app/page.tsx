import Footer from "@/components/footer";
import Menu from "@/components/Menu";

export default function Home() {
  return (
    <div className="h-full">
      <Menu />
      <div className="container">
        <main className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center">Bem-vindo à VipApp</h1>
          <p className="text-lg text-center">Entre para acessar.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
}
