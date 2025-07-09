"use client";

import { useState } from "react";

import { Button } from "../../components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/UI/card";

import { Input } from "../../components/UI/input";
import { Label } from "../../components/UI/label";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { MiniLoading } from "@/components/loading";
import { Logo64, LogoMedida } from "@/components/logo";

const TEXTS = {
  title: "Aministrativo Vida e Paz",
  description: "Entre com suas credenciais",
  userLabel: "Usuário",
  userPlaceholder: "usuario",
  passwordLabel: "Senha",
  forgotPassword: "Esqueceu a senha?",
  loginButton: "Entrar",
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro("");

    try {
      setLoading(true);
      const result = await login(username, password);
      setLoading(false);
      if (result) {
        const url = localStorage.getItem("RefreshLocal");
        localStorage.removeItem("RefreshLocal");
        url ? router.push(url) : router.push("/app");
      } else {
        router.push("/app");
      }
    } catch (err) {
      setErro("Usuário ou Senha Inválidos.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col justify-center items-center">
          <LogoMedida tamanho={110} />
            <CardDescription>{TEXTS.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="user">{TEXTS.userLabel}</Label>
              <Input
                id="user"
                type="text"
                placeholder={TEXTS.userPlaceholder}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{TEXTS.passwordLabel}</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10" // espaço pro ícone
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <CardFooter className="flex flex-col space-y-4 p-0">
              <Button type="submit" className="w-full">
                {loading ? <MiniLoading /> : TEXTS.loginButton}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
