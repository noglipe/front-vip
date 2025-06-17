import { decryptData } from "./crip";

export async function ApiNovo(
  url: string,
  method: string = "GET",
  dados: any = null
) {
  const token = await decryptData(localStorage.getItem("data"))?.access;

  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (dados) {
    if (dados instanceof FormData) {
      options.body = dados;
      // NÃO define Content-Type, o browser define automaticamente com boundary
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(dados);
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, options);

  if (!response.ok) {
    throw new Error(`Erro na Requisição! status: ${response.status}`);
  }

  return response;
}
