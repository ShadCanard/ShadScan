import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// When running in a browser the frontend can reach the backend
// via the current origin (same‑host proxy or exposed port). Use a
// build-time environment variable to override when necessary.
const defaultUri =
  typeof window !== "undefined"
    ? "/graphql" // assume same origin
    : process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || defaultUri,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          scans: {
            keyArgs: ["filter"],
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
