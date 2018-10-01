import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkNeedAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.NeedService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkNeedAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.Needs,
  })),
)(resolver);
