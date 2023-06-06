import { createMethodDecorator } from 'type-graphql';
import { ForbiddenError } from 'apollo-server-express';
import { Context } from './_types';

const Auth = (): any => createMethodDecorator<Context>(async ({ context }, next) => {
  if (!context.accountId) {
    throw new ForbiddenError('Forbidden.');
  }
  return next();
});

export default Auth;
