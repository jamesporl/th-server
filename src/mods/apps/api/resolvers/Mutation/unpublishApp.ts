import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { Context } from '../../../../../core/graphql/_types.js';
import Auth from '../../../../../core/graphql/Auth.js';
import DefaultMutationPayload from '../../../../base/api/entities/DefaultMutationPayload.js';
import { MApp, MAppTag } from '../../../db/index.js';
import { AppStatus } from '../../entities/_enums.js';
import { UnpublishAppInput } from '../../entities/Apps.js';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async unpublishApp(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UnpublishAppInput) input: UnpublishAppInput,
  ) {
    const { appId } = input;

    const app = await MApp.findOne({ _id: appId, ownedBy: accountId, status: AppStatus.published });

    if (!app) {
      throw new UserInputError('App not found.');
    }

    if (app.tagIds?.length) {
      await MAppTag.updateMany({ _id: { $in: app.tagIds } }, { $inc: { appsCount: -1 } });
    }

    await MApp.updateOne(
      { _id: appId },
      { $set: { status: AppStatus.unpublished } },
    );

    return { isCompleted: true };
  }
}
