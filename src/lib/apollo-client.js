import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { decryptData } from "./crip";

// Verifica o hostname (localhost ou IP de rede)
const host =
  typeof window !== "undefined" ? window.location.hostname : "localhost";

export const url =
  host === "localhost"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : process.env.NEXT_PUBLIC_BACKEND_URL2;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        // redireciona para a página de login
        Router.replace("/login");
        // ou window.location.href = "/login";
      }
    }
  }
  if (networkError) {
    // Se for erro 401 da rede:
    if ("statusCode" in networkError && networkError.statusCode === 401) {
      Router.replace("/login");
    }
  }
});

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
