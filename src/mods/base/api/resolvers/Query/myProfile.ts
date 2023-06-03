import { Resolver, Ctx, Query } from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import { MAccount } from '../../../db';
import { Profile } from '../../entities/Profile';

@Resolver()
export default class {
  @Auth()
  @Query(() => Profile, { nullable: true })
  async myProfile(@Ctx() { accountId }: Context) {
    const account = await MAccount.findOne({ _id: accountId }).lean();
    return account;
  }
}
