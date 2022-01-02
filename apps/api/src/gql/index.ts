import { ApolloServer } from 'apollo-server-express';
import { schemaLoader } from '@sprice237/accounting-gql';
import { context } from './context';
import { resolvers } from './resolvers';

export const buildApolloServer = async (): Promise<ApolloServer> => {
  const typeDefs = await schemaLoader();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [
      {
        async requestDidStart() {
          return {
            async didEncounterErrors(requestContext) {
              const {
                request: { query, operationName, variables, http },
                errors,
              } = requestContext;

              const { headers } = http ?? {};
              const headersObj = Object.fromEntries(headers ?? []);

              const errorObjs = errors.map((error) => ({
                name: error.name,
                message: error.message,
                extensions: error.extensions,
                stack: error.stack,
              }));

              console.dir(
                {
                  query,
                  operationName,
                  variables,
                  headers: headersObj,
                  errors: errorObjs,
                },
                { depth: null }
              );
            },
          };
        },
      },
    ],
  });
  await server.start();
  return server;
};
