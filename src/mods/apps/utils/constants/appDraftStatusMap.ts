import { AppDraftStatus } from '../../api/entities/_enums';

export default new Map([
  [AppDraftStatus.inProgress, 'In Progress'],
  [AppDraftStatus.submitted, 'Submitted'],
  [AppDraftStatus.published, 'Published'],
  [AppDraftStatus.deleted, 'Deleted'],
]);
