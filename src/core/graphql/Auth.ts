import { createMethodDecorator } from 'type-graphql';
import { ForbiddenError } from 'apollo-server-express';
import { RoleKey } from 'mods/base/api/entities/_enums';
import { Context } from './_types';

/* eslint-disable @typescript-eslint/no-explicit-any,implicit-arrow-linebreak */
const Auth = (roles: RoleKey[] = []): any =>
  createMethodDecorator<Context>(async ({ context }, next) => {
    if (!context.userId) {
      throw new ForbiddenError('Forbidden.');
    }
    if (roles.length && !roles.includes(context.role)) {
      throw new ForbiddenError('Forbidden.');
    }
    return next();
  });

export default Auth;
