import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyActivityAccess,
  checkFilesAccess,
  keyActivityUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.KeyActivityService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyActivityAccess(),
  checkFilesAccess(),
  keyActivityUpdateAfterware(),
)(resolver);
