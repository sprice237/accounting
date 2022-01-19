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
import { resolvers } from './schema';

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
                  keyArgs: (args) => {
                    // haven't figured out why yet... but sometimes at this point, startDate/endDate have already
                    // been serialized, and sometimes they haven't. don't know why. it took me hours just to diagnose
                    // the bug. as a bandaid, at this point we're just making sure that it's serialized.

                    const input = args?.['input'];

                    if (!input) {
                      return undefined;
                    }

                    let key = '';

                    for (const argsKey of Object.keys(input)) {
                      if (argsKey === 'pageToken') {
                        continue;
                      }
                      key += '|';
                      if (argsKey === 'startDate' || argsKey === 'endDate') {
                        key +=
                          input[argsKey] instanceof Date
                            ? resolvers.Date.serialize(input[argsKey])
                            : input[argsKey];
                      } else if (
                        argsKey === 'sourceAccountIds' ||
                        argsKey === 'categoryAccountIds'
                      ) {
                        key += JSON.stringify(input[argsKey]);
                      } else {
                        key += input[argsKey];
                      }
                    }

                    return key;
                  },
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
