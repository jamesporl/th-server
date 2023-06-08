import { AppStatus } from '../../api/entities/_enums';

export default new Map([
  [AppStatus.new, 'New'],
  [AppStatus.waiting, 'Waiting'],
  [AppStatus.published, 'Published'],
  [AppStatus.unpublished, 'Unpublished'],
  [AppStatus.deleted, 'Deleted'],
]);
