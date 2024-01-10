import Comment from './Comment.js';
import CommentStatusObject from './CommentStatusObject.js';
import Mutation from './Mutation/index.js';
import Query from './Query/index.js';

export default [
  Comment,
  CommentStatusObject,
  ...Mutation,
  ...Query,
];
