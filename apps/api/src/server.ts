import express from 'express';
import { buildApolloServer } from './gql/index';

export const startServer = async (): Promise<void> => {
  const app = express();

  const apolloServer = await buildApolloServer();
  apolloServer.applyMiddleware({ app });

  const port = process.env['PORT'] ?? 8080;
  await new Promise<void>((resolve) => app.listen(port, resolve));

  console.log(`Server started on port ${port}`);
};
