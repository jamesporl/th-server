import { Resolver, Ctx, Query } from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import { MAccount } from '../../../db/index.js';
import { Profile } from '../../entities/Profile.js';

@Resolver()
export default class {
  @Auth()
  @Query(() => Profile, { nullable: true })
  async myProfile(@Ctx() { accountId }: Context) {
    const account = await MAccount.findOne({ _id: accountId }).lean();
    return account;
  }
}
