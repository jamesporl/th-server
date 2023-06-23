import { UserInputError } from 'apollo-server-express';
import { Types } from 'mongoose';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import generateSixDigitCode from 'mods/base/utils/generateSixDigitCode';
import { MApp, MAppDraft } from '../../../db';
import { AddAppInput, App } from '../../entities/Apps';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => App)
  async addApp(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => AddAppInput) input: AddAppInput,
  ) {
    const { name: iName, shortDesc: iShortDesc } = input;

    const name = iName.trim();
    const shortDesc = iShortDesc.trim();

    if (name.length > 40) {
      throw new UserInputError('Name should not exceed 40 characters.');
    }
    if (shortDesc.length > 80) {
      throw new UserInputError('Short description should not exceed 80 characters.');
    }

    const appId = new Types.ObjectId();

    const newApp = await new MApp({
      _id: appId,
      name,
      shortDesc,
      status: AppStatus.new,
      slug: appId.toHexString(),
      ownedBy: new Types.ObjectId(accountId),
      randomId: generateSixDigitCode(),
    }).save();

    await new MAppDraft({
      appId,
      name,
      shortDesc,
      status: AppDraftStatus.inProgress,
      ownedBy: new Types.ObjectId(accountId),
    }).save();

    return newApp.toObject();
  }
}
