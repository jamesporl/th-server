import { CommentStatus } from '../../api/entities/_enums';

export default new Map([
  [CommentStatus.published, 'Published'],
  [CommentStatus.deleted, 'Deleted'],
]);
