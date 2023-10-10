/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { Types } from 'mongoose';
import { MApp, MAppTag } from '../db/index.js';
import { AppStatus } from '../api/entities/_enums.js';

export default async function updateAppsCountInTags() {
  let lastId: Types.ObjectId | undefined;
  let hasMore = true;
  while (hasMore) {
    const filter: { [key: string]: unknown } = {};
    if (lastId) {
      filter._id = { $gt: lastId };
    }

    const tags = await MAppTag.find(filter, { _id: 1 }).sort({ _id: 1 }).limit(100);
    if (tags.length) {
      for (const tag of tags) {
        const appsCount = await MApp.countDocuments({
          tagIds: tag._id,
          status: AppStatus.published,
        });
        await MAppTag.updateOne({ _id: tag._id }, { $set: { appsCount } });
      }
      lastId = tags[tags.length - 1]._id;
    } else {
      hasMore = false;
    }
  }
}
