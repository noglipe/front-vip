import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { decryptData } from "./crip";

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

const authLink = setContext((_, { headers }) => {
  const token = decryptData(localStorage.getItem("data")).access;

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
