import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyResourceAccess,
  checkFilesAccess,
  keyResourceUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.KeyResourceService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyResourceAccess(),
  checkFilesAccess(),
  keyResourceUpdateAfterware(),
)(resolver);
