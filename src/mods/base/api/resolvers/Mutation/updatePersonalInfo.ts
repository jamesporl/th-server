import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from '../../../../../core/graphql/Auth.js';
import { Context } from '../../../../../core/graphql/_types.js';
import { MAccount } from '../../../db/index.js';
import { Profile, UpdatePersonalInfoInput } from '../../entities/Profile.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => Profile)
  async updatePersonalInfo(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdatePersonalInfoInput) input: UpdatePersonalInfoInput,
  ) {
    const {
      firstName, lastName, shortDesc, bio, socialUrls, location, websiteUrl,
    } = input;

    const account = await MAccount.findOneAndUpdate(
      { _id: accountId },
      {
        $set: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          shortDesc,
          bio,
          socialUrls,
          location,
          websiteUrl,
          lastSeenAt: new Date(),
        },
      },
      { new: true, lean: true },
    );

    return account;
  }
}
