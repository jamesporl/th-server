/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { Types } from 'mongoose';
import generateSixDigitCode from 'mods/base/utils/generateSixDigitCode';
import { MApp } from '../db';

export default async function randomizeApps() {
  let lastId: Types.ObjectId | undefined;
  let hasMore = true;
  while (hasMore) {
    const filter: { [key: string]: unknown } = {};
    if (lastId) {
      filter._id = { $gt: lastId };
    }

    const apps = await MApp.find(filter, { _id: 1 }).sort({ _id: 1 }).limit(100);
    if (apps.length) {
      for (const app of apps) {
        await MApp.updateOne({ _id: app._id }, { $set: { randomId: generateSixDigitCode() } });
      }
      lastId = apps[apps.length - 1]._id;
    } else {
      hasMore = false;
    }
  }
}
