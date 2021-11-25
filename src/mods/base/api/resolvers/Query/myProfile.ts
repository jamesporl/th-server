import { Resolver, Ctx, Query } from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import { MAccount, MUser } from '../../../db';
import Profile from '../../entities/Profile';

@Resolver()
export default class {
  @Auth()
  @Query(() => Profile, { nullable: true })
  async myProfile(@Ctx() { roleId, userId }: Context) {
    const account = await MAccount.findOne({ userId });
    const user = await MUser.findOne({ _id: userId });
    const role = user.roles.find(r => r._id.toHexString() === roleId)

    return {
      ...account.toObject(),
      roleId: role._id.toHexString(),
      roles: user.roles,
    };
  }
}
