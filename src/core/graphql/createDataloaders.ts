import appsDataloaders from 'mods/apps/utils/dataloaders';
import baseDataloaders from 'mods/base/utils/dataloaders';

export default function createDataloaders() {
  return {
    ...appsDataloaders,
    ...baseDataloaders,
  };
}
