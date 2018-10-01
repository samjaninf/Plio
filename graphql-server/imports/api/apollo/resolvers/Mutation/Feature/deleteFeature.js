import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkFeatureAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.FeatureService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkFeatureAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.Features,
  })),
)(resolver);
