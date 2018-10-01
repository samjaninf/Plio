import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkWantAccess,
  wantUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.NeedService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkWantAccess(),
  wantUpdateAfterware(),
)(resolver);
