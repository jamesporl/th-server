import { UserInputError } from 'apollo-server-express';
import { Arg, Resolver, Query } from 'type-graphql';
import { MApp } from '../../../db';
import { App } from '../../entities/Apps';
import { AppStatus } from '../../entities/_enums';

@Resolver()
export default class {
  @Query(() => App)
  async app(
    @Arg('slug') slug: string, // eslint-disable-line @typescript-eslint/indent
  ) {
    const app = await MApp.findOne({ slug, status: AppStatus.published }).lean();
    if (!app) {
      throw new UserInputError('App not found');
    }
    return app;
  }
}
