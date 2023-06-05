import randomizeApps from 'mods/apps/utils/randomizeApps';

const jobsRegistry: {
  key: string;
  label: string;
  processJob: (params: unknown) => Promise<void>
}[] =  [
  {
    key: 'randomizeApps',
    label: 'Randomize apps',
    processJob: randomizeApps,
  },
];

export default jobsRegistry;
