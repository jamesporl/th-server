import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from 'core/graphql/_types';
import Auth from 'core/graphql/Auth';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import { MApp, MAppTag } from '../../../db';
import { AppStatus } from '../../entities/_enums';
import { RepublishAppInput } from '../../entities/Apps';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async republishApp(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => RepublishAppInput) input: RepublishAppInput,
  ) {
    const { appId } = input;

    const app = await MApp.findOne({
      _id: appId,
      ownedBy: accountId,
      status: AppStatus.unpublished,
    });

    if (!app) {
      throw new UserInputError('App not found.');
    }

    if (app.tagIds?.length) {
      await MAppTag.updateMany({ _id: { $in: app.tagIds } }, { $inc: { appsCount: 1 } });
    }

    await MApp.updateOne(
      { _id: appId },
      { $set: { status: AppStatus.published } },
    );

    return { isCompleted: true };
  }
}
