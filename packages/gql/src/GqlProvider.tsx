import { memo, useEffect, useState, FC } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { withScalars } from 'apollo-link-scalars';
import { createUploadLink } from 'apollo-upload-client';
import { GraphQLSchema } from 'graphql';

const buildLink = (uri: string, schema: GraphQLSchema, portfolioId: string | undefined) =>
  ApolloLink.from([
    withScalars({ schema }),
    setContext((_, prevContext) => ({
      ...prevContext,
      headers: {
        ...prevContext.headers,
        ...(portfolioId ? { 'x-portfolio-id': portfolioId } : {}),
      },
    })),
    createUploadLink({
      uri,
    }),
  ]);

export type GqlProviderProps = {
  uri: string;
  schema: GraphQLSchema;
  portfolioId: string | undefined;
};

export const GqlProvider: FC<GqlProviderProps> = memo(({ uri, schema, portfolioId, children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>();

  // initialize `client`
  useEffect(() => {
    setClient(
      new ApolloClient({
        cache: new InMemoryCache({
          typePolicies: {
            Query: {
              fields: {
                transactionItems: {
                  keyArgs: ['input', ['startDate', 'endDate', 'pageSize']],
                  merge: (existing, incoming) => ({
                    ...(existing ?? {}),
                    ...incoming,
                    transactionItems: [
                      ...(existing?.transactionItems ?? []),
                      ...incoming.transactionItems,
                    ],
                  }),
                },
              },
            },
          },
        }),
        link: buildLink(uri, schema, portfolioId),
      })
    );
  }, [uri, schema]);

  // update client link whenever uri, portfolioId changes
  useEffect(() => {
    if (!client) {
      return;
    }

    client.setLink(buildLink(uri, schema, portfolioId));
  }, [uri, schema]);

  if (!client) {
    return null;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
});
