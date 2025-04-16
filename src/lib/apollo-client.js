import { ApolloClient, InMemoryCache } from "@apollo/client";

// Verifica o hostname (localhost ou IP de rede)
const host =
  typeof window !== "undefined" ? window.location.hostname : "localhost";

// Usa URLs diferentes dependendo do acesso
export const url =
  host === "localhost"
    ? process.env.NEXT_PUBLIC_BACKEND_URL // ex: http://localhost:8000/
    : process.env.NEXT_PUBLIC_BACKEND_URL2; // ex: http://192.168.0.168:8000/

const client = new ApolloClient({
  uri: `${url}graphql/`,
  cache: new InMemoryCache(),
});

export default client;
