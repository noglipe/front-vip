import { decryptData } from "./crip";
import { redirect } from "next/navigation";

export async function ApiNovo(
    url: string,
    method: string = "GET",
    dados: any = null
) {
    const token = await decryptData(localStorage.getItem("data"))?.access;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (dados) {
        options.body = JSON.stringify(dados);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, options);

    if (!response.ok) {
        throw new Error(`Error na Requisição! status: ${response.status}`);
    }

    return response;
}
