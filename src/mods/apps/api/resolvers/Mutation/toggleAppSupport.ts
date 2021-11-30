import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import Auth from 'core/graphql/Auth';
import { MApp, MAppSupport } from '../../../db';
import { AppStatus } from '../../entities/_enums';
import { ToggleAppSupportInput } from '../../entities/AppSupports';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async toggleAppSupport(
    @Ctx() { accountId, dataloaders }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => ToggleAppSupportInput) input: ToggleAppSupportInput,
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId, status: AppStatus.published });
    if (!app) {
      throw new UserInputError('App not found');
    }

    const appSupportDoc = await MAppSupport.findOne({ appId, accountId });
    if (appSupportDoc) {
      await MAppSupport.deleteOne({ _id: appSupportDoc._id });
      await MApp.updateOne({ _id: appId }, { $inc: { supportsCount: -1 } });
    } else {
      await new MAppSupport({ appId, accountId }).save();
      await MApp.updateOne({ _id: appId }, { $inc: { supportsCount: 1 } });
    }

    dataloaders.appSupportLoader.clear(`${appId}_${accountId}`);

    return { isCompleted: true };
  }
}
