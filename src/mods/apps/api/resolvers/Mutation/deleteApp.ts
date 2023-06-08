import { UserInputError } from 'apollo-server-express';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import DefaultMutationPayload from 'mods/base/api/entities/DefaultMutationPayload';
import { MApp, MAppDraft, MAppTag } from '../../../db';
import { DeleteAppInput } from '../../entities/Apps';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => DefaultMutationPayload)
  async deleteApp(
    @Ctx() { accountId }: Context, // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => DeleteAppInput) input: DeleteAppInput,
  ) {
    const { appId } = input;
    const app = await MApp.findOne({
      _id: appId,
      ownedBy: accountId,
      status: { $in: [AppStatus.published, AppStatus.unpublished] },
    });

    if (!app) {
      throw new UserInputError('App not found');
    }

    await MAppDraft.updateMany(
      {
        appId,
        status: { $in: [AppDraftStatus.inProgress, AppDraftStatus.submitted] },
      },
      { $set: { status: AppDraftStatus.deleted } },
    );

    await MApp.updateMany({ _id: appId }, { $set: { status: AppStatus.deleted } });

    if (app.status === AppStatus.published && app.tagIds?.length) {
      await MAppTag.updateMany({ _id: { $in: app.tagIds } }, { $inc: { appsCount: -1 } });
    }

    return { isCompleted: true };
  }
}
