import 'reflect-metadata';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import echo from 'mods/base/api/resolvers/Mutation/echo';
import ping from 'mods/base/api/resolvers/Query/ping';
import appResolvers from 'mods/apps/api/resolvers';
import baseResolvers from 'mods/base/api/resolvers';

export default async function buildGqlSchema(): Promise<GraphQLSchema> {
  // resolvers need to be of type readonly [Function, ...Function[]]
  const resolvers = [
    ...appResolvers,
    ...baseResolvers,
  ];
  const gqlSchema = await buildSchema({
    resolvers: [ping, echo, ...resolvers],
  });
  return gqlSchema;
}
