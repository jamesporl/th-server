import { createMethodDecorator } from 'type-graphql';
import { ForbiddenError } from 'apollo-server-express';
import { Context } from './_types';

const IsAdmin = (): any => createMethodDecorator<Context>(async ({ context }, next) => {
  if (!context.accountId || !context.isAdmin) {
    throw new ForbiddenError('Forbidden.');
  }
  return next();
});

export default IsAdmin;
