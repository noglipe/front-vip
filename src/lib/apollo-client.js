import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Verifica o hostname (localhost ou IP de rede)
const host =
  typeof window !== "undefined" ? window.location.hostname : "localhost";

export const url =
  host === "localhost"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : process.env.NEXT_PUBLIC_BACKEND_URL2;

const httpLink = createHttpLink({
  uri: `${url}graphql/`,
  credentials: "include", // envia cookies, inclusive HttpOnly
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
