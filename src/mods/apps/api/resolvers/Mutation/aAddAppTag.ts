import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Resolver } from 'type-graphql';
import slugify from 'slugify';
import Auth from '../../../../../core/graphql/Auth.js';
import { MAppTag } from '../../../db/index.js';
import { App } from '../../entities/Apps.js';
import { AddAppTagInput } from '../../entities/AppTags.js';

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
