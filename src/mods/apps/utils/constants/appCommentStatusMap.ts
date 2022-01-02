import { AppCommentStatus } from '../../api/entities/_enums';

export default new Map([
  [AppCommentStatus.published, 'Published'],
  [AppCommentStatus.deleted, 'Deleted'],
]);
