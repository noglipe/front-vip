"use client "

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

    if (!response.ok) {
        throw new Error("Login inválido");
    }

    const data = await response.json();

    localStorage.setItem("data", encryptData(data));

    return data;
}
