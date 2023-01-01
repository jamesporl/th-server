import {
  Arg, Resolver, Query, Int,
} from 'type-graphql';
import { MAppTag } from '../../../db';
import { AppTag } from '../../entities/AppTags';

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
