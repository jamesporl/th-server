import { Resolver, Root, FieldResolver } from 'type-graphql';
import { Profile } from '../entities/Profile.js';
import { DbAccount } from '../../db/_types.js';

@Resolver(() => Profile)
export default class {
  @FieldResolver()
  email(
    @Root() { email: iEmail }: DbAccount, // eslint-disable-line @typescript-eslint/indent
  ) {
    const split = iEmail.split('@');
    return `${split[0].slice(0, 1)}***${split[0].slice(-2)}@${split[1]}`;
  }
}
