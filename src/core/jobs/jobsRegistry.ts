import randomizeApps from 'mods/apps/utils/randomizeApps';
import updateAppsCountInTags from 'mods/apps/utils/updateAppsCountInTags';

const jobsRegistry: {
  key: string;
  label: string;
  processJob: (params: unknown) => Promise<void>
}[] = [
  {
    key: 'randomizeApps',
    label: 'Randomize apps',
    processJob: randomizeApps,
  },
  {
    key: 'updateAppsCountInTags',
    label: 'Update apps count in tags',
    processJob: updateAppsCountInTags,
  },
];

export default jobsRegistry;
