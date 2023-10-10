import connectToMongo from './core/loaders/connectToMongo.js';
import buildGqlSchema from './core/loaders/buildGqlSchema.js';
import loadInitialData from './core/loaders/loadInitialData.js';
import createJobWorker from './core/jobs/createJobWorker.js';
import startExpress from './core/loaders/startExpress.js';

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  await connectToMongo();
  await loadInitialData();
  const gqlSchema = await buildGqlSchema();
  await createJobWorker();
  await startExpress(gqlSchema);
})();
