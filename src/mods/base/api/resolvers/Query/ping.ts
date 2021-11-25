/* eslint-disable class-methods-use-this */
import { Resolver, Query } from 'type-graphql';

@Resolver()
export default class {
  @Query(() => String)
  ping(): string {
    return 'pong';
  }
}
