import { ForbiddenError, UserInputError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import { RoleKey } from 'mods/base/api/entities/_enums';
import { MApp, MAppDraft, MAppTag } from '../../../db';
import { UpdateAppDraftInput, App, AppDraft } from '../../entities/Apps';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => AppDraft)
  async updateAppDraft(
    @Ctx() { accountId, role }: Context,  // eslint-disable-line @typescript-eslint/indent
    @Arg('input', () => UpdateAppDraftInput) input: UpdateAppDraftInput,
  ) {
    const { appId, name, shortDesc, desc, tagIds, ...rest  } = input;

    if (name.length > 40) {
      throw new UserInputError('Name should not exceed 40 characters.');
    }
    if (shortDesc.length > 80) {
      throw new UserInputError('Short description should not exceed 80 characters.')
    }

    if (desc && desc.length > 1000) {
      throw new UserInputError('Description is too long.')
    }

    if (tagIds?.length > 3) {
      throw new UserInputError('Maximum of 3 tags are allowed');
    }

    const appDraft = await MAppDraft.findOne({
      appId, status: { $nin: [AppDraftStatus.published, AppDraftStatus.deleted] },
    });
    const app = await MApp.findOne({ _id: appId });
    if (!appDraft) {
      throw new UserInputError('App not found.');
    }
    if (role === RoleKey.user && appDraft.ownedBy.toHexString() !== accountId) {
      throw new ForbiddenError('Forbidden.');
    }

    if (tagIds?.length) {
      const tagDocs = await MAppTag.find({ _id: { $in: tagIds } });
      if (tagDocs.length !== tagIds.length) {
        throw new UserInputError('Invalid tag');
      }
    }

    const updatedAppDraft = await MAppDraft.findOneAndUpdate(
      { appId },
      { $set: { name, shortDesc, desc, tagIds, ...rest } },
      { new: true, lean: true },
    );

    if (app.status === AppStatus.new && (app.name !== name || app.shortDesc !== shortDesc)) {
      await MApp.updateOne({ _id: appId }, { name, shortDesc });
    }
    
    return updatedAppDraft;
  }
}
