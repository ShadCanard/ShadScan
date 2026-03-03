import { DocumentNode } from "graphql";
import { apolloClient } from "./apollo-client";

// Basic wrappers around Apollo client that can be used with TanStack Query
export async function graphqlQuery<T>(query: DocumentNode, variables?: any): Promise<T> {
  const result = await apolloClient.query({ query, variables });
  return result.data as T;
}

export async function graphqlMutate<T>(mutation: DocumentNode, variables?: any): Promise<T> {
  const result = await apolloClient.mutate({ mutation, variables });
  return result.data as T;
}