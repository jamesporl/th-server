import 'reflect-metadata';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import appResolvers from '../../mods/apps/api/resolvers/index.js';
import baseResolvers from '../../mods/base/api/resolvers/index.js';
import actionsResolvers from '../../mods/actions/api/resolvers/index.js';
import echo from '../../mods/base/api/resolvers/Mutation/echo.js';
import ping from '../../mods/base/api/resolvers/Query/ping.js';

export default async function buildGqlSchema(): Promise<GraphQLSchema> {
  // resolvers need to be of type readonly [Function, ...Function[]]
  const resolvers = [
    ...appResolvers,
    ...baseResolvers,
    ...actionsResolvers,
  ];
  const gqlSchema = await buildSchema({
    resolvers: [ping, echo, ...resolvers],
  });
  return gqlSchema;
}
