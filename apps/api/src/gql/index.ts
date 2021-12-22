import { ApolloServer } from 'apollo-server-express';
import { schemaLoader } from '@sprice237/accounting-gql';
import { resolvers } from './resolvers';

export const buildApolloServer = async (): Promise<ApolloServer> => {
  const typeDefs = await schemaLoader();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      {
        async requestDidStart() {
          return {
            async didEncounterErrors(requestContext) {
              console.log('graphql error', requestContext);
            },
          };
        },
      },
    ],
  });
  await server.start();
  return server;
};
