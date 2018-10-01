import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyResourceAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.KeyResourceService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyResourceAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.KeyResources,
  })),
)(resolver);
