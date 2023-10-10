import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { MAppTag } from '../../../db/index.js';
import { AppTag } from '../../entities/AppTags.js';

@Resolver()
export default class {
  @Query(() => AppTag, { nullable: true })
  async appTag(
    @Arg('slug') slug: string, // eslint-disable-line @typescript-eslint/indent
  ) {
    const tag = await MAppTag.findOne({ slug });
    return tag;
  }
}
