import { memo, useEffect, useState, FC } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

const buildLink = (uri: string, token: string | undefined, organizationId: string | undefined) =>
  ApolloLink.concat(
    setContext((_, prevContext) => ({
      ...prevContext,
      headers: {
        ...prevContext.headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(organizationId ? { 'x-organization-id': organizationId } : {}),
      },
    })),
    createUploadLink({
      uri,
    })
  );

export type GqlProviderProps = {
  uri: string;
  token?: string;
  organizationId?: string;
};

export const GqlProvider: FC<GqlProviderProps> = memo(
  ({ uri, token, organizationId, children }) => {
    const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>();

    // initialize `client`
    useEffect(() => {
      setClient(
        new ApolloClient({
          cache: new InMemoryCache(),
          link: buildLink(uri, token, organizationId),
        })
      );
    }, []);

    // update client link whenever uri, token, or organizationId changes
    useEffect(() => {
      if (!client) {
        return;
      }

      client.setLink(buildLink(uri, token, organizationId));
    }, [uri, token, organizationId]);

    if (!client) {
      return null;
    }

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }
);
