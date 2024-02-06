import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { Context, AccountContext } from '../graphql/_types.js';
import createDataloaders from '../graphql/createDataloaders.js';
import config from '../config.js';
import logger from '../logger.js';
import getAccountByJwt from '../../mods/base/utils/getAccountByJwt.js';

function addUserContextFromJwt(
  req: express.Request & { userContext: AccountContext },
  res: express.Response,
  next: express.NextFunction,
): void {
  const { headers } = req;
  const { authorization: authToken } = headers;
  if (authToken) {
    const userContext = getAccountByJwt(authToken);
    if (userContext.accountId) {
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
  const dataloaders = createDataloaders();
  let ipAddress = '';
  const xFF = req.headers['x-forwarded-for'];
  if (Array.isArray(xFF) && xFF.length) {
    [ipAddress] = req.headers['x-forwarded-for'];
  } else if (!Array.isArray(xFF) && xFF) {
    ipAddress = xFF;
  }
  return {
    ...req.userContext,
    dataloaders,
    ipAddress,
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
