import appsDataloaders from '../../mods/apps/utils/dataloaders/index.js';
import baseDataloaders from '../../mods/base/utils/dataloaders/index.js';
import actionsDataloaders from '../../mods/actions/utils/dataloaders/index.js';

export default function createDataloaders() {
  return {
    ...appsDataloaders,
    ...baseDataloaders,
    ...actionsDataloaders,
  };
}
