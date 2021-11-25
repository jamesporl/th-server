import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import getUserByJwt from 'mods/base/utils/getUserByJwt';
import { graphqlUploadExpress } from 'graphql-upload';
import { Context } from 'core/graphql/_types';
import config from '../config';
import logger from '../logger';

function addUserContextFromJwt(
  req: express.Request & { userContext: Context },
  res: express.Response,
  next: express.NextFunction,
): void {
  const { headers } = req;
  const { authorization: authToken } = headers;
  if (authToken) {
    const userContext = getUserByJwt(authToken);
    if (userContext.userId) {
      req.userContext = userContext;
      next();
      return;
    }
    res.status(404).send(JSON.stringify({}));
    return;
  }
  next();
}

function buildGqlContext(
  { req }: { req: express.Request & { userContext: Context } },
): Context {
  return {
    ...req.userContext,
  };
}

export default async function startExpress(gqlSchema: GraphQLSchema): Promise<void> {
  const server = new ApolloServer({
    formatError: (error) => {
      if (process.env.NODE_ENV !== 'production') {
        logger.error(error);
      }
      return error;
    },
    schema: gqlSchema,
    context: buildGqlContext,
  });

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(
    '/graphql',
    addUserContextFromJwt,
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  );
  await server.start();
  server.applyMiddleware({ app });

  app.listen(
    { port: config.PORT },
    () => logger.info(`🚀 Server ready at http://localhost:${config.PORT}${server.graphqlPath}`),
  );
}
