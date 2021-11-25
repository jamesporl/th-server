import { InterfaceType, Field, ID } from 'type-graphql';

@InterfaceType()
export default abstract class Node {
  @Field(() => ID)
  _id: string;
}
