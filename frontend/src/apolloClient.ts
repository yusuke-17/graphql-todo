import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httplink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, prevContext) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...prevContext.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httplink),
  cache: new InMemoryCache(),
});

export default client;
