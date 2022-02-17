import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import { MAccount, MUser } from '../../../db';
import { Profile, UpdatePersonalInfoInput } from '../../entities/Profile';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => Profile)
  async updatePersonalInfo(
    @Ctx() { userId, roleId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdatePersonalInfoInput) input: UpdatePersonalInfoInput,
  ) {
    const { firstName, lastName, shortDesc } = input;

    const account = await MAccount.findOneAndUpdate(
      { userId },
      {
        $set: {
          firstName, lastName, name: `${firstName} ${lastName}`, shortDesc,
        },
      },
      { new: true, lean: true },
    );

    const user = await MUser.findOneAndUpdate({ _id: userId }, { $set: { firstName, lastName } });

    const role = user.roles.find((r) => r._id.toHexString() === roleId);

    return {
      ...account,
      roleId: role._id.toHexString(),
      roles: user.roles,
    };
  }
}
