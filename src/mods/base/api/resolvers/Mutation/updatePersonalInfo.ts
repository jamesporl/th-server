import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import { MAccount } from '../../../db';
import { Profile, UpdatePersonalInfoInput } from '../../entities/Profile';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => Profile)
  async updatePersonalInfo(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdatePersonalInfoInput) input: UpdatePersonalInfoInput,
  ) {
    const { firstName, lastName, shortDesc } = input;

    const account = await MAccount.findOneAndUpdate(
      { _id: accountId },
      {
        $set: {
          firstName, lastName, name: `${firstName} ${lastName}`, shortDesc,
        },
      },
      { new: true, lean: true },
    );

    return account;
  }
}
