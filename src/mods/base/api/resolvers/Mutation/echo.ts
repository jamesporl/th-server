import { Resolver, Arg, Mutation } from 'type-graphql';

@Resolver()
export default class {
  @Mutation(() => String)
  echo(@Arg('str') str: string): string {
    return `${str}`;
  }
}
