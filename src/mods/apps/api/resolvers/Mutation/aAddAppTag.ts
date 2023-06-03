import { UserInputError } from 'apollo-server-express';
import { Types } from 'mongoose';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import Auth from 'core/graphql/Auth';
import { Context } from 'core/graphql/_types';
import { MApp, MAppDraft, MAppTag } from '../../../db';
import { AddAppInput, App } from '../../entities/Apps';
import { AppDraftStatus, AppStatus } from '../../entities/_enums';
import { AddAppTagInput } from '../../entities/AppTags';
import slugify from 'slugify';

@Resolver()
export default class {
  @Auth()
  @Mutation(() => App)
  async aAddAppTag(
    @Arg('input', () => AddAppTagInput) input: AddAppTagInput, // eslint-disable-line @typescript-eslint/indent
  ) {
    const { name } = input;
    
    const slug = slugify(name, { lower: true, trim: true, strict: true });

    const slugExists = await MAppTag.findOne({ slug });
    if (slugExists) {
      throw new UserInputError('Tag already exists');
    }

    const newTag = await new MAppTag({
      name,
      slug,
    }).save();

    return newTag.toObject();
  }
}
