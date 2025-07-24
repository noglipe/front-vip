"use client "

import { toast } from 'sonner';
import { encryptData } from '../lib/crip'

export async function login(username: string, password: string) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        toast.error("Erro!", {
            description: data.detail || "Falha na autenticação",
        }
        );
        throw new Error(data.detail || "Login inválido");
    }

    localStorage.setItem("data", encryptData(data));

    return data;
}
