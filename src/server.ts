import startExpress from 'core/loaders/startExpress';
import connectToMongo from 'core/loaders/connectToMongo';
import buildGqlSchema from 'core/loaders/buildGqlSchema';
import loadInitialData from 'core/loaders/loadInitialData';
import createJobWorker from 'core/jobs/createJobWorker';

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  await connectToMongo();
  await loadInitialData();
  const gqlSchema = await buildGqlSchema();
  await createJobWorker();
  await startExpress(gqlSchema);
})();
