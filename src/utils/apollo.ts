import {
  ApolloLink,
  HttpLink,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { GET_PACKAGES } from "../graphql/query";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJVc2VyIiwiQWRtaW4iXSwic3ViIjoiNjZhOGY5ZmUtZmZkOS00NmRmLWE0YzItMDE4OWU4YzRjODc3IiwidXNlcm5hbWUiOiJ5b2FkbWluIiwiaWF0IjoxNjk4OTMwMTQ5LCJleHAiOjE2OTkwMDIxNDl9.gQ0amex3lKQdMtPNIbjSX-45PeVio6nDIwvnwMTmqDQ";
// console.log(token);
const authLink = new ApolloLink((operation, forward) => {
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});
const httpLink = new HttpLink({ uri: import.meta.env.VITE_API_KEY });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

async function fetchPackages({ queryKey }: any) {
  const [, { page, limit }] = queryKey;
  const { data } = await client.query({
    query: GET_PACKAGES,
    variables: { page, limit },
  });
  return data;
}

export { client, fetchPackages };
