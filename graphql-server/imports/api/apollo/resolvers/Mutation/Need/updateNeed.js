import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkNeedAccess,
  needUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.NeedService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkNeedAccess(),
  needUpdateAfterware(),
)(resolver);
